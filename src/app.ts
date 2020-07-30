import * as fs from "fs";
import { analyse } from "./analyser";
import { inspect } from "util";
const args = process.argv.slice(2);
const input = args[0];

fs.statSync(input);
if (input.endsWith("/")) {
  const packageJson = `${input}package.json`;
  const json = JSON.parse(fs.readFileSync(packageJson, "utf8"));
  console.log(json);
  const startingFile = `${input}${json.main}`;
  console.log(startingFile);
  console.log(inspect(analyse(startingFile), false, null, true));
  process.exit();
}

console.log(inspect(analyse(input), false, null, true));
