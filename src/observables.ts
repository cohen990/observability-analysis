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
  scope: Scope
): Array<Observable> {
  const observables: Array<Observable> = [];
  variables.forEach((x) => {
    observables.push({ variable: x, observed: false });
  });
  calls.forEach((call) => {
    observables.filter(
      (observable) =>
        isObserving(observable, call) &&
        isInScope(observable.variable, call, scope)
    )[0].observed = true;
  });
  return observables;
}

function isObserving(observable: Observable, call: Observation) {
  return observable.variable.name === call.observed;
}

function isInScope(
  variable: Variable,
  call: Observation,
  scope: Scope
): boolean {
  return scope.isInScope(call.scope, variable.scope);
}
