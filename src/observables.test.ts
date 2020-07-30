import { getObservables } from "./observables";
import { flatten } from "./syntaxTree";
import { getSample } from "./testSamples";
import { SyntaxKind, VariableDeclaration, CallExpression } from "typescript";
import { compile } from "./compile";
import { filterOutNodeModules } from "./analyser";
import { variableFrom } from "./variable";
import { observationFrom } from "./observation";

it("should list all unobserved", () => {
  const fileName = getSample("single-assignment-to-const-and-console-log");
  const compiled = compile(fileName);
  const source = filterOutNodeModules(compiled)[0];
  const flattened = flatten(source);
  const declaration = variableFrom(
    flattened.filter(
      (x) => x.kind === SyntaxKind.VariableDeclaration
    )[0] as VariableDeclaration,
    source
  );

  const declarations = getObservables([declaration], []);
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
    flattened.filter(
      (x) => x.kind === SyntaxKind.VariableDeclaration
    )[0] as VariableDeclaration,
    source
  );
  const observation = observationFrom(
    flattened.filter(
      (x) => x.kind === SyntaxKind.CallExpression
    )[0] as CallExpression
  );

  const observables = getObservables([declaration], [observation]);

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
    .filter((x) => x.kind === SyntaxKind.VariableDeclaration)
    .map((x) => variableFrom(x as VariableDeclaration, source));
  const observations = flattened
    .filter((x) => x.kind === SyntaxKind.CallExpression)
    .map((x) => observationFrom(x as CallExpression));

  const observables = getObservables(declarations, observations);

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
