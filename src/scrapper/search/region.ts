import axios from "axios";
import { JSDOM } from "jsdom";
import { decodeDom } from "@/scrapper/lib/utils";

export async function getDepartments(regionId: string) {
    const request = await axios({
        responseType: "arraybuffer",
        url: `https://orobnat.sante.gouv.fr/orobnat/afficherPage.do?methode=menu&usd=AEP&idRegion=${ regionId }`
    });

    const result = decodeDom(await request.data);

    return departmentsExtractor(result);
}

function departmentsExtractor(dom: string) {
    const document = (new JSDOM(dom)).window.document;
    const departments = Object.fromEntries(
        [...document
            .querySelector("[name='departement']")
            .querySelectorAll("option")
        ]
            .map((option) => [
                option.value,
                option.textContent?.trim()
            ])
    );

    return departments as Record<string, string>;
}
