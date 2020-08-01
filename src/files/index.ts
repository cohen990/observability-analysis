import { createProgram, SourceFile } from "typescript";
import * as fs from "fs";

export function getMain(projectPath) {
  const packageJson = `${projectPath}package.json`;
  const json = JSON.parse(fs.readFileSync(packageJson, "utf8"));
  return `${projectPath}${json.main}`;
}

export function compile(target: string): ReadonlyArray<SourceFile> {
  const program = createProgram([target], {});
  return program.getSourceFiles();
}

export function isNotNodeModule(file: SourceFile): boolean {
  return !/node_modules/.test(file.fileName);
}
