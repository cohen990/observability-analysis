import { VariableDeclaration, CallExpression } from "typescript";
import { Variable } from "./variable";
import { Observation } from "./observation";

export interface Observable {
  variable: Variable;
  observed: boolean;
}

export function getObservables(
  variables: Array<Variable>,
  calls: Array<Observation>
): Array<Observable> {
  const observables: Array<Observable> = [];
  variables.forEach((x) => {
    observables.push({ variable: x, observed: false });
  });
  calls.forEach((call) => {
    observables.filter(
      (observable) => observable.variable.name === call.name
    )[0].observed = true;
  });
  return observables;
}
