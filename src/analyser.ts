import {
  SyntaxKind,
  CallExpression,
  Declaration,
  SourceFile,
  VariableDeclaration,
} from "typescript";
import { flatten } from "./syntaxTree";
import { getObservables, Observable } from "./observables";
import { compile } from "./compile";
import { variableFrom } from "./variable";
import { observationFrom } from "./observation";

interface FileObservability {
  file: string;
  rating: number;
  observables: Array<Observable>;
}

export function analyse(target: string): Array<FileObservability> {
  const compiled = compile(target);
  const libraryFiles = filterOutNodeModules(compiled);

  return libraryFiles.map(analyseFile);
}

function analyseFile(file: SourceFile): FileObservability {
  const allNodes = flatten(file);

  const observations = allNodes
    .filter(isCallExpression)
    .filter(isCalledWithAVariable)
    .map(observationFrom);

  const variables = allNodes
    .filter(isVariableDeclaration)
    .map((x) => variableFrom(x as VariableDeclaration, file));

  const observables = getObservables(variables, observations);

  const observed = observables.filter((x) => x.observed).length;

  return {
    file: file.fileName,
    rating: observed / observables.length,
    observables,
  };
}

export function filterOutNodeModules(
  compiled: ReadonlyArray<SourceFile>
): ReadonlyArray<SourceFile> {
  return compiled.filter((f) => !/node_modules/.test(f.fileName));
}

function isCalledWithAVariable(node: CallExpression): boolean {
  return node.arguments[0].kind === SyntaxKind.Identifier;
}

function isCallExpression(node: Declaration): boolean {
  return node.kind === SyntaxKind.CallExpression;
}

function isVariableDeclaration(node: Declaration): boolean {
  return node.kind === SyntaxKind.VariableDeclaration;
}
