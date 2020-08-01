import { SourceFile } from "typescript";
import { FileObservability } from "./analysis";
import { flatten } from "../syntaxTree";
import { observationFrom } from "../syntax/observation";
import { variableFrom } from "../syntax/variable";
import { buildScope } from "../scope";
import { getObservables } from "../observables";
import { ObservationNode, SyntaxNode } from "../syntax/syntaxNode";

export function analyseFile(
  file: SourceFile,
  observers: Array<string>
): FileObservability {
  const allNodes = flatten(file);

  const observations = allNodes
    .filter((x) => x.isObservation(observers))
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

  const rating =
    observables.length === 0 ? "NoRating" : observed / observables.length;

  return {
    file: file.fileName,
    rating,
    observables,
  };
}

function isCalledWithAVariable(node: ObservationNode): boolean {
  return node.isCalledWithAVariable();
}

function isVariableDeclaration(node: SyntaxNode): boolean {
  return node.isVariableDeclaration();
}
