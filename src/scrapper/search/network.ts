import axios from "axios";
import { JSDOM } from "jsdom";
import { scrapperStore } from "@/scrapper/store";
import { decodeDom, saveDom } from "@/scrapper/lib/utils";

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
}

