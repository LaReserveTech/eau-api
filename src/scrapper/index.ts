import { initCookies } from "@/scrapper/lib/cookies";
import { getDepartments } from "@/scrapper/search/region";
import { regions } from "@/scrapper/data/regions";
import { getCities } from "@/scrapper/search/department";

(async () => {
    await initCookies();

    const departments = await getDepartments("11");
    console.log(departments);

    const cities = await getCities(Object.keys(departments)[1]);
    console.log(cities);


    /*
    for (const region of Object.keys(regions)) {
        const departments = await getDepartments(region);
        console.log(departments);
    }
     */

})().then(() => {
    console.log("done!");
});
