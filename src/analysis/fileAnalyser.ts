import { SourceFile } from "typescript";
import { FileObservability } from "./analysis";
import { flatten } from "../syntaxTree";
import { observationFrom } from "../syntax/observation";
import { variableFrom, variablesFromFunction } from "../syntax/variable";
import { buildScope } from "../scope";
import { getObservables, Observable } from "../observables";
import {
  ObservationNode,
  toObservation,
  isObservation,
} from "../syntax/nodes/observationNode";
import { isVariable, toVariable } from "../syntax/nodes/variableNode";
import { SyntaxNode } from "../syntax/nodes/syntaxNode";
import {
  isFunctionWithParameters,
  toFunction,
} from "../syntax/nodes/functionNode";

export function analyseFile(
  file: SourceFile,
  observers: Array<string>
): FileObservability {
  const allNodes = flatten(file);

  const { variables, observations, scope } = analyseAst(
    allNodes,
    observers,
    file
  );

  const observables = getObservables(variables, observations, scope);

  return {
    file: file.fileName,
    rating: calculateRating(observables),
    observables,
  };
}

function calculateRating(observables: Observable[]) {
  const numberObserved = observables.filter((x) => x.observed).length;

  const rating =
    observables.length === 0 ? "NoRating" : numberObserved / observables.length;
  return rating;
}

function analyseAst(
  allNodes: SyntaxNode[],
  observers: string[],
  file: SourceFile
) {
  const observations = getObservations(allNodes, observers);
  const variables = getVariables(allNodes, file);
  const scope = buildScope(allNodes);
  return { variables, observations, scope };
}

function getVariables(allNodes: SyntaxNode[], file: SourceFile) {
  const variables = getSimpleVariables(allNodes, file);
  const functionVariables = getFunctionVariables(allNodes, file);
  const allVariables = variables.concat(functionVariables);
  return allVariables;
}

function getFunctionVariables(allNodes: SyntaxNode[], file: SourceFile) {
  return allNodes
    .filter(isFunctionWithParameters)
    .map(toFunction)
    .map((x) => variablesFromFunction(x, file))
    .reduce((x, y) => x.concat(y), []);
}

function getSimpleVariables(allNodes: SyntaxNode[], file: SourceFile) {
  return allNodes
    .filter(isVariable)
    .map(toVariable)
    .map((x) => variableFrom(x, file));
}

function getObservations(allNodes: SyntaxNode[], observers: string[]) {
  return allNodes
    .filter((x) => isObservation(x, observers))
    .map(toObservation)
    .filter(isCalledWithAVariable)
    .map(observationFrom);
}

function isCalledWithAVariable(node: ObservationNode): boolean {
  return node.isCalledWithAVariable();
}
