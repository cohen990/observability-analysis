import { getObservables } from "../../src/observables";
import { flatten } from "../../src/syntaxTree";
import { getSample } from "../samples";
import { compile, isNotNodeModule } from "../../src/files/";
import { variableFrom } from "../../src/syntax/variable";
import { observationFrom } from "../../src/syntax/observation";
import { buildScope } from "../../src/scope";

describe("observables", () => {
  const sample = (file) => getSample(file, "observables/");
  it("should list all unobserved", () => {
    const fileName = sample("single-assignment-to-const-and-console-log");
    const compiled = compile(fileName);
    const source = compiled.filter(isNotNodeModule)[0];
    const flattened = flatten(source);
    const declaration = variableFrom(
      flattened.filter((x) => x.isVariableDeclaration())[0].toVariable(),
      source
    );

    const declarations = getObservables(
      [declaration],
      [],
      buildScope(flattened)
    );
    expect(declarations).toHaveLength(1);
    expect(declarations[0]).toMatchObject({
      variable: { name: "a" },
      observed: false,
    });
  });

  it("should recognise observed", () => {
    const fileName = sample("single-assignment-to-const-and-console-log");
    const compiled = compile(fileName);
    const source = compiled.filter(isNotNodeModule)[0];
    const flattened = flatten(source);
    const declaration = variableFrom(
      flattened.filter((x) => x.isVariableDeclaration())[0].toVariable(),
      source
    );
    const observation = observationFrom(
      flattened
        .filter((x) => x.isObservation(["console.log"]))[0]
        .toObservation()
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
    const compiled = compile(sample(fileName));
    const source = compiled.filter(isNotNodeModule)[0];

    const flattened = flatten(source);

    const declarations = flattened
      .filter((x) => x.isVariableDeclaration())
      .map((x) => variableFrom(x.toVariable(), source));
    const observations = flattened
      .filter((x) => x.isObservation(["console.log"]))
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
});
