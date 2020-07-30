import * as fs from "fs";
export function getSample(name: string) {
  const file = `${process.cwd()}/samples/${name}.ts`;

  ensureExists(file);

  return file;
}

function ensureExists(file: string) {
  return fs.statSync(file);
}
