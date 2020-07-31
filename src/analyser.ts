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
import { variableFrom } from "./base/variable";
import { observationFrom } from "./base/observation";
import { SyntaxNode, ObservationNode, VariableNode } from "./base/syntaxNode";
import { buildScope } from "./base/scope";

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
    .map((x) => x.toObservation())
    .filter(isCalledWithAVariable)
    .map(observationFrom);

  const variables = allNodes
    .filter(isVariableDeclaration)
    .map((x) => x.toVariable())
    .map((x) => variableFrom(x, file));

  const scope = buildScope(allNodes);

  const observables = getObservables(variables, observations, scope);

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

function isCalledWithAVariable(node: ObservationNode): boolean {
  return node.isCalledWithAVariable();
}

function isCallExpression(node: SyntaxNode): boolean {
  return node.isCallExpression();
}

function isVariableDeclaration(node: SyntaxNode): boolean {
  return node.isVariableDeclaration();
}
