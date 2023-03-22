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

/*
    config: {
        idRegion: (document.querySelector("[name='idRegion']") as HTMLInputElement)?.value,
            posPLV: (document.querySelector("[name='posPLV']") as HTMLInputElement)?.value,
            reseau: document.querySelector("[name='reseau']")?.querySelector("option")?.value,
            usd: (document.querySelector("[name='usd']") as HTMLInputElement)?.value
    },
 */
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
