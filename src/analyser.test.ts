import { Analyser } from "./analyser";
it("should have 0 observability", () => {
  const input = `${process.cwd()}/samples/single-assignment-to-const.ts`;
  const observability = new Analyser().analyseFile(input);
  expect(observability).toBe(0);
});

it("should have 1 observability when console logging all assigned variables", () => {
  const input = `${process.cwd()}/samples/single-assignment-to-const-and-console-log.ts`;
  const observability = new Analyser().analyseFile(input);
  expect(observability).toBe(1);
});

it("should have 0 observability when console logging none of the variables", () => {
  const input = `${process.cwd()}/samples/single-assignment-to-const-and-console-log-of-unrelated-const.ts`;
  const observability = new Analyser().analyseFile(input);
  expect(observability).toBe(0);
});

it("should have 0.5 observability when console logging only half of the variables", () => {
  const input = `${process.cwd()}/samples/two-assignment-to-const-and-console-log-of-one-of-them.ts`;
  const observability = new Analyser().analyseFile(input);
  expect(observability).toBe(0.5);
});
