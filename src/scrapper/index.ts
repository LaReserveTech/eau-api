import { initCookies } from "@/scrapper/lib/cookies";
import { getDepartments } from "@/scrapper/search/region";
import { regions } from "@/scrapper/data/regions";

(async () => {
    await initCookies();

    for (const region of Object.keys(regions)) {
        const departments = await getDepartments(region);
        console.log(departments);
    }

})().then(() => {
    console.log("done!");
});
