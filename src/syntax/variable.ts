import { SourceFile } from "typescript";
import { VariableNode } from "./nodes/variableNode";
import { FunctionNode } from "./nodes/functionNode";

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

export function variablesFromFunction(
  node: FunctionNode,
  source: SourceFile
): Array<Variable> {
  const parameter = node.getParameter();
  return [
    {
      name: parameter.getName(),
      lineNumber: parameter.getLine(source),
      character: parameter.getCharacter(source),
      sourceFile: source.fileName,
      scope: node.scope,
      parentScope: node.parentScope,
    },
  ];
}
