import { ObservationNode } from "./nodes/observationNode";

export interface Observation {
  observed: Array<string>;
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
