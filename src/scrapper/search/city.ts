import axios from "axios";
import { scrapperStore } from "@/scrapper/store";

export async function getCity() {
    const searchRequest = await axios(
        {
            data: {
                communeDepartement: 91001,
                departement: 91,
                idRegion: 11,
                methode: "rechercher",
                posPLV: 0,
                reseau: "091000569_091",
                usd: "AEP"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: scrapperStore.cookie
            },
            method: "POST",
            url: "https://orobnat.sante.gouv.fr/orobnat/rechercherResultatQualite.do",
            withCredentials: true
        }
    );

    const result = await searchRequest.data;

    console.log(result);

    return result;
}
