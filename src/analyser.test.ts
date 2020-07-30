import { analyseFile } from "./analyser";
import { getSample } from "./testSamples";
it("should have 0 observability", () => {
  const file = getSample("single-assignment-to-const");
  const observability = analyseFile(file);
  expect(observability.rating).toBe(0);
  expect(observability.observables).toHaveLength(1);
  expect(observability.observables[0]).toEqual({
    name: "a",
    observed: false,
  });
  expect(observability.file).toBe(file);
});

it("should have 1 observability when console logging all assigned variables", () => {
  const file = getSample("single-assignment-to-const-and-console-log");
  const observability = analyseFile(file);
  expect(observability.rating).toBe(1);
});

it("should have 0 observability when console logging none of the variables", () => {
  const file = getSample(
    "single-assignment-to-const-and-console-log-of-unrelated-const"
  );
  const observability = analyseFile(file);
  expect(observability.rating).toBe(0);
});

it("should have 0.5 observability when console logging only half of the variables", () => {
  const file = getSample(
    "two-assignment-to-const-and-console-log-of-one-of-them"
  );
  const observability = analyseFile(file);
  expect(observability.rating).toBe(0.5);
});
