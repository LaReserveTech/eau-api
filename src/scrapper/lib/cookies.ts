import axios from "axios";
import { scrapperStore } from "@/scrapper/store";

export async function initCookies() {
    const cookieRequest = await axios({
        url: "https://orobnat.sante.gouv.fr/orobnat/afficherPage.do?methode=menu&usd=AEP&idRegion=11"
    });

    const cookies = cookieRequest.headers["set-cookie"];
    const cookiesHeaders = cookies?.map(
        (cookies) => cookies.split(";")[0]
    ).join("; ");

    if (!cookiesHeaders) {
        throw new Error("Undefined cookies for scrapper...");
    }

    scrapperStore.cookie = cookiesHeaders;
}
