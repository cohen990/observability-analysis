import * as fs from "fs";
import { analyse } from "./analyser";
import { inspect } from "util";
import { getMain } from "./projects";
const args = process.argv.slice(2);
const input = args[0];

fs.statSync(input);
if (input.endsWith("/")) {
  const main = getMain(input);
  console.log(inspect(analyse(main), false, null, true));
  process.exit();
}

console.log(inspect(analyse(input), false, null, true));
