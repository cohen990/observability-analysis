import { SyntaxNode, ObservationNode } from "./syntaxNode";

export interface Observation {
  name: string;
  scope: string;
  parentScope: string;
}
export function observationFrom(node: ObservationNode): Observation {
  return {
    name: node.getName(),
    scope: node.scope,
    parentScope: node.parentScope,
  };
}
