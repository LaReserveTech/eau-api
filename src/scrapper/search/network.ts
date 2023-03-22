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

    return dataExtractor(document);
}

function dataExtractor(document: Document) {
    const target = document.querySelector("form[name=rechercherResultatQualiteForm] p:nth-of-type(4) > span")?.textContent
        ?.split("\n")
        .map((element) => element.trim().substring(2).replace("<br>", ""))
        .filter((element) => !!element);

    const conformity = [...(document.querySelector(".block-content:nth-of-type(4) table")?.querySelectorAll("tr") || [])].map((line) => ({
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
            conformity,
            results
        },
        target
    };
}
