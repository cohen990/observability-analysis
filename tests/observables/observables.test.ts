import { getObservables } from "../../src/observables";
import { flatten } from "../../src/syntaxTree";
import { getSample } from "../samples";
import { compile, isNotNodeModule } from "../../src/files/";
import { variableFrom } from "../../src/syntax/variable";
import { observationFrom } from "../../src/syntax/observation";
import { buildScope } from "../../src/scope";
import {
  toObservation,
  isObservation,
} from "../../src/syntax/nodes/observationNode";
import { isVariable, toVariable } from "../../src/syntax/nodes/variableNode";

describe("observables", () => {
  const sample = (file) => getSample(file, "observables/");
  it("should list all unobserved", () => {
    const fileName = sample("single-assignment-to-const-and-console-log");
    const compiled = compile(fileName);
    const source = compiled.filter(isNotNodeModule)[0];
    const flattened = flatten(source);
    const declaration = variableFrom(
      flattened.filter(isVariable).map(toVariable)[0],
      source
    );

    const declarations = getObservables(
      [declaration],
      [],
      buildScope(flattened)
    );
    expect(declarations).toHaveLength(1);
    expect(declarations[0]).toMatchObject({
      variable: { name: "observableA" },
      observed: false,
    });
  });

  it("should recognise observed", () => {
    const fileName = sample("single-assignment-to-const-and-console-log");
    const compiled = compile(fileName);
    const source = compiled.filter(isNotNodeModule)[0];
    const flattened = flatten(source);
    const declaration = variableFrom(
      flattened.filter(isVariable).map(toVariable)[0],
      source
    );
    const observation = observationFrom(
      toObservation(
        flattened.filter((x) => isObservation(x, ["console.log"]))[0]
      )
    );

    const observables = getObservables(
      [declaration],
      [observation],
      buildScope(flattened)
    );

    expect(observables).toHaveLength(1);
    expect(observables[0]).toMatchObject({
      variable: { name: "observableA" },
      observed: true,
    });
  });

  it("should recognise multiple observed", () => {
    const fileName = "two-assignment-to-const-and-console-log-both";
    const compiled = compile(sample(fileName));
    const source = compiled.filter(isNotNodeModule)[0];

    const flattened = flatten(source);

    const declarations = flattened
      .filter(isVariable)
      .map(toVariable)
      .map((x) => variableFrom(x, source));
    const observations = flattened
      .filter((x) => isObservation(x, ["console.log"]))
      .map((x) => observationFrom(toObservation(x)));

    const observables = getObservables(
      declarations,
      observations,
      buildScope(flattened)
    );

    expect(observables).toHaveLength(2);
    expect(observables[1]).toMatchObject({
      variable: { name: "observableB" },
      observed: true,
    });
    expect(observables[0]).toMatchObject({
      variable: { name: "observableC" },
      observed: true,
    });
  });
});
