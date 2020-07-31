import * as fs from "fs";
export function getSample(name: string) {
  if (name.endsWith("/")) {
    const directory = `${process.cwd()}/tests/samples/${name}`;
    ensureExists(directory);
    return directory;
  }

  const file = `${process.cwd()}/tests/samples/${name}.ts`;
  ensureExists(file);
  return file;
}

function ensureExists(file: string) {
  return fs.statSync(file);
}
