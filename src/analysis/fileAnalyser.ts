import { SourceFile } from "typescript";
import { FileObservability } from "./analysis";
import { flatten } from "../syntaxTree";
import { observationFrom } from "../syntax/observation";
import { variableFrom, variablesFromFunction } from "../syntax/variable";
import { buildScope } from "../scope";
import { getObservables } from "../observables";
import { ObservationNode } from "../syntax/nodes/observationNode";

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
    .filter((x) => x.isVariable())
    .map((x) => x.toVariable())
    .map((x) => variableFrom(x, file));

  const functionVariables = allNodes
    .filter((x) => x.isFunctionWithParameters())
    .map((x) => x.toFunction())
    .map((x) => variablesFromFunction(x, file))
    .reduce((x, y) => x.concat(y), []);

  const allVariables = variables.concat(functionVariables);

  const scope = buildScope(allNodes);

  const observables = getObservables(allVariables, observations, scope);
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
