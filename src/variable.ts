import { VariableDeclaration, SourceFile, isSourceFile } from "typescript";

export interface Variable {
  name: string;
  sourceFile: string;
  lineNumber: number;
  character: number;
}

export function variableFrom(
  node: VariableDeclaration,
  source: SourceFile
): Variable {
  const lineAndCharacter = source.getLineAndCharacterOfPosition(node.pos);

  return {
    name: (node.name as any).text,
    lineNumber: lineAndCharacter.line + 1,
    character: lineAndCharacter.character,
    sourceFile: source.fileName,
  };
}
