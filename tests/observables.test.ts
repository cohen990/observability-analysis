import { getObservables } from "../src/observables";
import { flatten } from "../src/syntaxTree";
import { getSample } from "./samples";
import { SyntaxKind, VariableDeclaration, CallExpression } from "typescript";
import { compile } from "../src/compile";
import { filterOutNodeModules } from "../src/analyser";
import { variableFrom } from "../src/base/variable";
import { observationFrom } from "../src/base/observation";
import { VariableNode, ObservationNode } from "../src/base/syntaxNode";
import { buildScope } from "../src/base/scope";

it("should list all unobserved", () => {
  const fileName = getSample("single-assignment-to-const-and-console-log");
  const compiled = compile(fileName);
  const source = filterOutNodeModules(compiled)[0];
  const flattened = flatten(source);
  const declaration = variableFrom(
    flattened.filter((x) => x.isVariableDeclaration())[0].toVariable(),
    source
  );

  const declarations = getObservables([declaration], [], buildScope(flattened));
  expect(declarations).toHaveLength(1);
  expect(declarations[0]).toMatchObject({
    variable: { name: "a" },
    observed: false,
  });
});

it("should recognise observed", () => {
  const fileName = getSample("single-assignment-to-const-and-console-log");
  const compiled = compile(fileName);
  const source = filterOutNodeModules(compiled)[0];
  const flattened = flatten(source);
  const declaration = variableFrom(
    flattened.filter((x) => x.isVariableDeclaration())[0].toVariable(),
    source
  );
  const observation = observationFrom(
    flattened.filter((x) => x.isCallExpression())[0].toObservation()
  );

  const observables = getObservables(
    [declaration],
    [observation],
    buildScope(flattened)
  );

  expect(observables).toHaveLength(1);
  expect(observables[0]).toMatchObject({
    variable: { name: "a" },
    observed: true,
  });
});

it("should recognise multiple observed", () => {
  const fileName = "two-assignment-to-const-and-console-log-both";
  const compiled = compile(getSample(fileName));
  const source = filterOutNodeModules(compiled)[0];

  const flattened = flatten(source);

  const declarations = flattened
    .filter((x) => x.isVariableDeclaration())
    .map((x) => variableFrom(x.toVariable(), source));
  const observations = flattened
    .filter((x) => x.isCallExpression())
    .map((x) => observationFrom(x.toObservation()));

  const observables = getObservables(
    declarations,
    observations,
    buildScope(flattened)
  );

  expect(observables).toHaveLength(2);
  expect(observables[1]).toMatchObject({
    variable: { name: "a" },
    observed: true,
  });
  expect(observables[0]).toMatchObject({
    variable: { name: "b" },
    observed: true,
  });
});
