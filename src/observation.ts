import { CallExpression } from "typescript";

export interface Observation {
  name: string;
}
export function observationFrom(node: CallExpression): Observation {
  return { name: (node.arguments[0] as any).text };
}
