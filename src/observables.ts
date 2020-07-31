import { Variable } from "./base/variable";
import { Observation } from "./base/observation";
import { Scope } from "./base/scope";

export interface Observable {
  variable: Variable;
  observed: boolean;
}

export function getObservables(
  variables: Array<Variable>,
  calls: Array<Observation>,
  scope
): Array<Observable> {
  const observables: Array<Observable> = [];
  variables.forEach((x) => {
    observables.push({ variable: x, observed: false });
  });
  calls.forEach((call) => {
    observables.filter(
      (observable) =>
        observable.variable.name === call.name &&
        isInScope(observable, call, scope)
    )[0].observed = true;
  });
  return observables;
}

function isInScope(
  observable: Observable,
  call: Observation,
  scope: Scope
): boolean {
  return scope.isInScope(call.scope, observable.variable.scope);
}
