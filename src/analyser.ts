import {
  SyntaxKind,
  CallExpression,
  Declaration,
  VariableDeclaration,
} from "typescript";
import { flatten } from "./syntaxTree";
import { getObservables, Observable } from "./observables";

interface ObservabilityOverview {
  rating: number;
  observables: Array<Observable>;
  file: string;
}

export function analyseFile(target: string): ObservabilityOverview {
  let declarations: Array<VariableDeclaration> = [];
  let observations: Array<CallExpression> = [];
  const allNodes = flatten(target);

  allNodes.forEach((node) => {
    if (isCallExpression(node)) {
      if (isCalledWithAVariable(node as CallExpression)) {
        observations.push(node as CallExpression);
      }
    } else if (isVariableDeclaration(node)) {
      declarations.push(node as VariableDeclaration);
    }
  });
  const observables = getObservables(declarations, observations);

  const observed = observables.filter((x) => x.observed).length;
  return {
    rating: observed / observables.length,
    observables,
    file: target,
  };
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
