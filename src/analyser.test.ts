import { analyseFile } from "./analyser";
import { getSample } from "./testSamples";
it("should have 0 observability", () => {
  const input = getSample("single-assignment-to-const");
  const observability = analyseFile(input);
  expect(observability.rating).toBe(0);
});

it("should have 1 observability when console logging all assigned variables", () => {
  const input = getSample("single-assignment-to-const-and-console-log");
  const observability = analyseFile(input);
  expect(observability.rating).toBe(1);
});

it("should have 0 observability when console logging none of the variables", () => {
  const input = getSample(
    "single-assignment-to-const-and-console-log-of-unrelated-const"
  );
  const observability = analyseFile(input);
  expect(observability.rating).toBe(0);
});

it("should have 0.5 observability when console logging only half of the variables", () => {
  const input = getSample(
    "two-assignment-to-const-and-console-log-of-one-of-them"
  );
  const observability = analyseFile(input);
  expect(observability.rating).toBe(0.5);
});
