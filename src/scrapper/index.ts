import * as fs from "fs";
import path from "path";
import { initCookies } from "@/scrapper/lib/cookies";
import { getDepartments } from "@/scrapper/search/region";
import { regions } from "@/scrapper/data/regions";
import { getCities } from "@/scrapper/search/department";
import { getNetworks } from "@/scrapper/search/city";
import { getNetworkData } from "@/scrapper/search/network";
import { upsertNetwork } from "@/services/network/lib";
import { upsertCity } from "@/services/city/lib";
import { upsertSampling } from "@/services/sampling/lib";
import { closeDatabase, connectDatabase } from "@/database";

(async () => {
    await initCookies();
    await loopScrapping();
})().then(() => {
    console.log("done!");
});

async function loopScrapping() {
    await connectDatabase();

    for (const [region, regionName] of Object.entries(regions)) {
        console.log(`Fetching region "${ regionName }"`);
        const departments = await getDepartments({ region });

        for (const [department, departmentName] of Object.entries(departments)) {
            console.log(`- Fetching department "${ departmentName }"`);
            const cities = await getCities({ department, region });

            for (const [city, cityName] of Object.entries(cities)) {
                console.log(`- - Fetching city "${ cityName }"`);
                const networks = await getNetworks({ city, department, region });

                for (const [network, networkName] of Object.entries(networks)) {
                    console.log(`- - - Fetching network "${ networkName }"`);
                    const networkData = await getNetworkData({ city, department, network, region });

                    await upsertNetwork(network, networkName);
                    await upsertCity({ name: cityName, code: city, department, departmentName, region, regionName }, Object.keys(networks));
                    await upsertSampling(networkData.info.sampling.date, network, networkData);
                }
            }
        }
    }

    await closeDatabase();
}
