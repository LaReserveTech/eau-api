import axios from "axios";
import { load } from "cheerio";
import { decodeDom, saveDom } from "@/scrapper/lib/utils";

export async function getDepartments(regionId: string) {
    const request = await axios({
        responseType: "arraybuffer",
        url: `https://orobnat.sante.gouv.fr/orobnat/afficherPage.do?methode=menu&usd=AEP&idRegion=${ regionId }`
    });

    const result = decodeDom(await request.data);

    saveDom(result, "department.html");

    return departmentsExtractor(result);
}

function departmentsExtractor(dom: string) {
    const $ = load(dom);

    console.log(dom);
}
