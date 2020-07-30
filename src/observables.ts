import { VariableDeclaration, CallExpression } from "typescript";

export interface Observable {
  name: string;
  observed: boolean;
}

export function getObservables(
  variables: Array<VariableDeclaration>,
  calls: Array<CallExpression>
): Array<Observable> {
  const observables: Array<Observable> = [];
  variables.forEach((x) => {
    const name = (x.name as any).text;
    observables.push({ name, observed: false });
  });
  calls.forEach((x) => {
    const name = (x.arguments[0] as any).text;
    observables.filter((y) => y.name === name)[0].observed = true;
  });
  return observables;
}
