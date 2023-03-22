import axios from "axios";
import { JSDOM } from "jsdom";
import { decodeDom } from "@/scrapper/lib/utils";

export async function getDepartments({ region }: {region: string}) {
    const request = await axios({
        responseType: "arraybuffer",
        url: `https://orobnat.sante.gouv.fr/orobnat/afficherPage.do?methode=menu&usd=AEP&idRegion=${ region }`
    });

    const dom = decodeDom(await request.data);
    //saveDom(dom, "departments.html");
    const document = (new JSDOM(dom)).window.document;

    return departmentsExtractor(document);
}

function departmentsExtractor(document: Document) {
    const departments = Object.fromEntries(
        [...document
            .querySelector("[name='departement']")
            ?.querySelectorAll("option") || []
        ]
            .map((option) => [
                option.value,
                option.textContent?.trim()
            ])
    );

    return departments as Record<string, string>;
}
