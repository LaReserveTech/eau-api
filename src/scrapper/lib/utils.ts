import * as fs from "fs";
import * as path from "path";
import iconv from "iconv-lite";

export function saveDom(dom: string, filePath: string) {
    fs.writeFileSync(path.join(__dirname, "/../temp/", filePath), dom);
}

export function loadDom(filePath: string) {
    fs.readFileSync(path.join(__dirname, "/../temp/", filePath));
}

// DOM is encoded in windows-1252, but we want it in UTF-8
export function decodeDom(buffer: Buffer) {
    return iconv.decode(buffer, "windows-1252");
}
