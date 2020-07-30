import { analyse } from "./analyser";
import { getSample } from "./testSamples";
it("should have 0 observability", () => {
  const file = getSample("single-assignment-to-const");
  const observability = analyse(file);
  expect(observability).toHaveLength(1);
  expect(observability[0].rating).toBe(0);
  expect(observability[0].observables).toHaveLength(1);
  expect(observability[0].observables[0]).toEqual({
    variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
    observed: false,
  });
  expect(observability[0].file).toBe(file);
});

it("should have 1 observability when console logging all assigned variables", () => {
  const file = getSample("single-assignment-to-const-and-console-log");
  const observability = analyse(file);
  expect(observability[0].rating).toBe(1);
});

it("should have 0 observability when console logging none of the variables", () => {
  const file = getSample(
    "single-assignment-to-const-and-console-log-of-unrelated-const"
  );
  const observability = analyse(file);
  expect(observability[0].rating).toBe(0);
});

it("should have 0.5 observability when console logging only half of the variables", () => {
  const file = getSample(
    "two-assignment-to-const-and-console-log-of-one-of-them"
  );
  const observability = analyse(file);
  expect(observability[0].rating).toBe(0.5);
});

it("should calculate separate observabilities for each file", () => {
  const file = getSample("file-importing-another-module");
  const expectedModule = getSample("some-module");
  const observability = analyse(file);
  expect(observability).toHaveLength(2);
  expect(observability[0].rating).toBe(1);
  expect(observability[0].observables).toHaveLength(1);
  expect(observability[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 1, sourceFile: expectedModule },
    observed: true,
  });
  expect(observability[0].file).toBe(expectedModule);
  expect(observability[1].rating).toBe(0.5);
  expect(observability[1].observables).toHaveLength(2);
  expect(observability[1].observables[0]).toMatchObject({
    variable: { name: "d", lineNumber: 4, sourceFile: file },
    observed: false,
  });
  expect(observability[1].observables[1]).toMatchObject({
    variable: { name: "c", lineNumber: 3, sourceFile: file },
    observed: true,
  });
  expect(observability[1].file).toBe(file);
});
