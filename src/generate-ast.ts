import * as fs from "fs";
import { inspect } from "util";
import { compile, isNotNodeModule } from "./files";
const args = process.argv.slice(2);
const input = args[0];

fs.statSync(input);

const files = compile(input).filter(isNotNodeModule);
files.forEach((file) => {
  console.log(`><><><><><${file.fileName}><><><><><><`);
  console.log(inspect(file, { depth: null }));
  console.log("\n\n\n");
});
