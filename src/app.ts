import * as fs from "fs";
import { analyseFile } from "./analyser";
const args = process.argv.slice(2);
const file = args[0];

fs.statSync(file);

console.log(analyseFile(file));
