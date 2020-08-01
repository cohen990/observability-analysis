import { Variable } from "./syntax/variable";
import { Observation } from "./syntax/observation";
import { Scope } from "./scope";

export interface Observable {
  variable: Variable;
  observed: boolean;
}

export function getObservables(
  variables: Array<Variable>,
  calls: Array<Observation>,
  scope: Scope
): Array<Observable> {
  const observables = variables.map(toObservable);
  calls.forEach((call) => matchObservations(call, observables, scope));

  return observables;
}

function toObservable(variable: Variable) {
  return { variable, observed: false };
}

function matchObservations(
  call: Observation,
  observables: Array<Observable>,
  scope: Scope
): void {
  observables
    .filter((observable) => isObserving(observable, call, scope))
    .forEach(markObserved);
}

function isObserving(
  observable: Observable,
  call: Observation,
  scope: Scope
): boolean {
  return (
    variableMatches(observable, call) &&
    isInScope(observable.variable, call, scope)
  );
}

function variableMatches(observable: Observable, call: Observation): boolean {
  return call.observed.indexOf(observable.variable.name) >= 0;
}

function isInScope(
  variable: Variable,
  call: Observation,
  scope: Scope
): boolean {
  return scope.isInScope(call.scope, variable.scope);
}

function markObserved(observable: Observable): void {
  observable.observed = true;
}
