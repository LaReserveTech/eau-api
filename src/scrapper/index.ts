import { initCookies } from "@/scrapper/lib/cookies";
import { getDepartments } from "@/scrapper/search/region";
import { regions } from "@/scrapper/data/regions";
import { getCities } from "@/scrapper/search/department";
import { getCityData, getNetworks } from "@/scrapper/search/city";
import { getNetworkData } from "@/scrapper/search/network";

(async () => {
    await initCookies();

    const cities = await getCities({ department: "075", region: "11" });
    console.log(cities);
    const networks = await getNetworks({ city: "75056", department: "075", region: "11" });
    console.log(networks);
    const networkData = await getNetworkData({ city: "75056", department: "075", network: "075000227_075", region: "11" });

})().then(() => {
    console.log("done!");
});

async function loopScrapping() {
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

                    return;
                }
            }
        }
    }
}
