import * as fs from "fs";
import { analyse } from "./analyser";
import { inspect } from "util";
const args = process.argv.slice(2);
const file = args[0];

fs.statSync(file);

console.log(inspect(analyse(file), false, null, true));
