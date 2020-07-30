import { getObservables } from "./observables";
import { flatten } from "./syntaxTree";
import { getSample } from "./testSamples";
import { SyntaxKind, VariableDeclaration, CallExpression } from "typescript";

it("should list all unobserved", () => {
  const flattened = flatten(getSample("single-assignment-to-const"));
  const declaration = flattened.filter(
    (x) => x.kind === SyntaxKind.VariableDeclaration
  )[0] as VariableDeclaration;

  const declarations = getObservables([declaration], []);
  expect(declarations).toHaveLength(1);
  expect(declarations[0]).toEqual({
    name: "a",
    observed: false,
  });
});

it("should recognise observed", () => {
  const flattened = flatten(
    getSample("single-assignment-to-const-and-console-log")
  );
  const declaration = flattened.filter(
    (x) => x.kind === SyntaxKind.VariableDeclaration
  )[0] as VariableDeclaration;
  const observation = flattened.filter(
    (x) => x.kind === SyntaxKind.CallExpression
  )[0] as CallExpression;

  const observables = getObservables([declaration], [observation]);

  expect(observables).toHaveLength(1);
  expect(observables[0]).toEqual({
    name: "a",
    observed: true,
  });
});

it("should recognise multiple observed", () => {
  const fileName = "two-assignment-to-const-and-console-log-both";
  const flattened = flatten(getSample(fileName));
  const declarations = flattened
    .filter((x) => x.kind === SyntaxKind.VariableDeclaration)
    .map((x) => x as VariableDeclaration);
  const observations = flattened
    .filter((x) => x.kind === SyntaxKind.CallExpression)
    .map((x) => x as CallExpression);

  const observables = getObservables(declarations, observations);

  expect(observables).toHaveLength(2);
  expect(observables[1]).toEqual({
    name: "a",
    observed: true,
  });
  expect(observables[0]).toEqual({
    name: "b",
    observed: true,
  });
});
