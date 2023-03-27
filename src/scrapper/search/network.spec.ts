import path from "path";
import * as fs from "fs";
import { cleanData } from "@/scrapper/search/network";

describe("network", () => {
    test("should clean data", async () => {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, "./../temp/data.json"), { encoding: "utf8" }));

        console.log(JSON.stringify(cleanData(data), null, 4));
    });
});
