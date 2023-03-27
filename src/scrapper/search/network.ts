import axios from "axios";
import { JSDOM } from "jsdom";
import { scrapperStore } from "@/scrapper/store";
import { decodeDom } from "@/scrapper/lib/utils";

export async function getNetworkData({ city, department, network, region }: {city: string; department: string; network: string; region: string}) {
    const request = await axios(
        {
            data: {
                communeDepartement: city,
                departement: department,
                idRegion: region,
                methode: "rechercher",
                reseau: network
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: scrapperStore.cookie
            },
            method: "POST",
            responseType: "arraybuffer",
            url: "https://orobnat.sante.gouv.fr/orobnat/rechercherResultatQualite.do",
            withCredentials: true
        }
    );

    const dom = decodeDom(await request.data);
    //saveDom(dom, "network.html");
    const document = (new JSDOM(dom)).window.document;

    const extractedData = dataExtractor(document);
    return cleanData(extractedData);
}

function dataExtractor(document: Document) {
    const target = document.querySelector("form[name=rechercherResultatQualiteForm] p:nth-of-type(4) > span")?.textContent
        ?.split("\n")
        .map((element) => element.trim().substring(2).replace("<br>", ""))
        .filter((element) => !!element);

    const sampling = [...(document.querySelector(".block-content:nth-of-type(4) table")?.querySelectorAll("tr") || [])].map((line) => ({
        key: line.querySelector("th")?.textContent,
        value: line.querySelector("td")?.textContent
    }));

    const results = [...(document.querySelector(".block-content:nth-of-type(5) table")?.querySelectorAll("tr") || [])].map((line) => ({
        key: line.querySelector("th")?.textContent,
        value: line.querySelector("td")?.textContent?.replaceAll("\t", "").replaceAll("\n", "")
    })).filter((line) => !!line.key);

    const analysis = [...(document.querySelector(".block-content:nth-of-type(6) table")?.querySelectorAll("tr") || [])].map((line) => ({
        key: line.querySelector("td:nth-of-type(1)")?.textContent,
        limit: line.querySelector("td:nth-of-type(3)")?.textContent,
        ref: line.querySelector("td:nth-of-type(4)")?.textContent,
        value: line.querySelector("td:nth-of-type(2)")?.textContent
    })).filter((line) => !!line.key);

    return {
        info: {
            analysis,
            results,
            sampling
        },
        target
    };
}

export function cleanData(data: ReturnType<typeof dataExtractor>) {
    const dateString = data.info.sampling.find((element) => element.key?.includes("Date du prélèvement"))?.value?.trim();
    const dateSplit = dateString.split(/\s\s+/);
    const daySplit = dateSplit[0].split("/");
    const hourSplit = dateSplit[1].split("h");

    const date = new Date(daySplit[2], daySplit[1] - 1, daySplit[0], hourSplit[0], hourSplit[1]);

    const sampling = {
        city: data.info.sampling.find((element) => element.key?.includes("Commune"))?.value?.trim(),
        date,
        installation: data.info.sampling.find((element) => element.key?.includes("Installation"))?.value?.trim(),
        manager: data.info.sampling.find((element) => element.key?.includes("Responsable"))?.value?.trim(),
        owner: data.info.sampling.find((element) => element.key?.includes("Maître"))?.value?.trim(),
        service: data.info.sampling.find((element) => element.key?.includes("Service"))?.value?.trim()
    };

    const results = {
        bacteriologicalCheck: data.info.results.find((element) => element.key?.includes("Conformité bactériologique"))?.value === "oui",
        conclusion: data.info.results.find((element) => element.key?.includes("Conclusions sanitaires"))?.value?.trim(),
        physicalCheck: data.info.results.find((element) => element.key?.includes("Conformité physico-chimique"))?.value === "oui",
        qualityCheck: data.info.results.find((element) => element.key?.includes("Respect des références de qualité"))?.value === "oui"
    };

    const analysisKeyMap = {
        "Ammonium (en NH4)": "ammonium",
        "Aspect (qualitatif)": "aspect",
        "Bact. aér. revivifiables à 22°-68h": "low-aerobic-bacteria",
        "Bact. aér. revivifiables à 36°-44h": "high-aerobic-bacteria",
        "Bact. et spores sulfito-rédu./100ml": "sulfite-reducing-bacteria",
        "Bactéries coliformes /100ml-MS": "coliform-bacteria",
        "Chlore libre *": "free-chlorine",
        "Chlore total *": "total-chlorine",
        "Coloration": "coloration",
        "Conductivité à 25°C": "conductivity",
        "Couleur (qualitatif)": "color",
        "Entérocoques /100ml-MS": "enterococci",
        "Escherichia coli /100ml - MF": "escherichia-coli",
        "Fer total": "total-iron",
        "Odeur (qualitatif)": "odor",
        "pH": "ph",
        "pH *": "field-ph",
        "Saveur (qualitatif)": "taste",
        "Température de l'eau *": "water-temperature",
        "Turbidité néphélométrique NFU": "turbidity"
    };

    const analysis = Object.fromEntries(
        data.info.analysis.map((element) => {
            const key = element.key?.trim().replace(" *", " (field)");

            const realKey = analysisKeyMap[element.key];

            const result: {
                key: string;
                limit?: string;
                ref?: string;
                unit?: string;
                value?: string;
            } = { key };

            if (key.includes("qualitatif")) {
                result.value = element.value?.trim();
            }
            else {
                const splitValue = element.value?.split(" ");
                result.value = splitValue?.shift()?.replace(",", ".");
                result.unit = splitValue?.join(" ");
            }

            if (element.limit) {
                result.limit = element.limit?.trim().replace(",", ".").replaceAll(/\s\s+/g, " ");
            }

            if (element.ref) {
                result.ref = element.ref?.trim().replace(",", ".").replaceAll(/\s\s+/g, " ");
            }

            return [realKey, result];
        }
        ));

    return {
        info: {
            analysis,
            results,
            sampling
        },
        target: data.target
    };
}
