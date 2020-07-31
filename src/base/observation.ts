import { SyntaxNode, ObservationNode } from "./syntaxNode";

export interface Observation {
  observed: string;
  scope: string;
  parentScope: string;
}
export function observationFrom(node: ObservationNode): Observation {
  return {
    observed: node.getObserved(),
    scope: node.scope,
    parentScope: node.parentScope,
  };
}
