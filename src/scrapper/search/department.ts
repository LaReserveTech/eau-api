import axios from "axios";
import { JSDOM } from "jsdom";
import { decodeDom } from "@/scrapper/lib/utils";
import { scrapperStore } from "@/scrapper/store";

export async function getCities(department: string) {
    const request = await axios(
        {
            data: {
                departement: department,
                methode: "changerDepartement"
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

    const result = decodeDom(await request.data);
    const document = (new JSDOM(result)).window.document;

    return citiesExtractor(document);
}

function citiesExtractor(document: Document) {
    const cities = Object.fromEntries(
        [...document
            .querySelector("[name='communeDepartement']")
            ?.querySelectorAll("option") || []
        ]
            .map((option) => [
                option.value,
                option.textContent?.trim()
            ])
    );

    return cities as Record<string, string>;
}
