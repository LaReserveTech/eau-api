import axios from "axios";
import { JSDOM } from "jsdom";
import { scrapperStore } from "@/scrapper/store";
import { decodeDom } from "@/scrapper/lib/utils";

export async function getNetworks({ city, department, region }: {city: string; department: string; region: string}) {
    const request = await axios(
        {
            data: {
                communeDepartement: city,
                departement: department,
                idRegion: region,
                methode: "changerCommune"
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
    //saveDom(dom, "networks.html");
    const document = (new JSDOM(dom)).window.document;

    return networksExtractor(document);
}


function networksExtractor(document: Document) {
    const networks = Object.fromEntries(
        [...document
            .querySelector("[name='reseau']")
            ?.querySelectorAll("option") || []
        ]
            .map((option) => [
                option.value,
                option.textContent?.trim()
            ])
    );

    return networks as Record<string, string>;
}

