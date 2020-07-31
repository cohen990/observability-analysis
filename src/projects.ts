import * as fs from "fs";

export function getMain(projectPath) {
  const packageJson = `${projectPath}package.json`;
  const json = JSON.parse(fs.readFileSync(packageJson, "utf8"));
  return `${projectPath}${json.main}`;
}
