import { initCookies } from "@/scrapper/lib/cookies";
import { searchCity } from "@/scrapper/lib/search";
import { getDepartments } from "@/scrapper/search/region";

(async () => {
    await initCookies();

    await getDepartments("02");
    //await searchCity();
})().then(() => {
    console.log("done!");
});
