import { SourceFile } from "typescript";
import { VariableNode } from "./syntaxNode";

export interface Variable {
  name: string;
  sourceFile: string;
  lineNumber: number;
  character: number;
  scope: string;
  parentScope: string;
}

export function variableFrom(node: VariableNode, source: SourceFile): Variable {
  return {
    name: node.getName(),
    lineNumber: node.getLine(source),
    character: node.getCharacter(source),
    sourceFile: source.fileName,
    scope: node.scope,
    parentScope: node.parentScope,
  };
}
