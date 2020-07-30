import { createProgram, SourceFile } from "typescript";
export function compile(target: string): ReadonlyArray<SourceFile> {
  const program = createProgram([target], {});
  return program.getSourceFiles();
}
