import { analyse } from "../src/analyser";
import { getSample } from "./samples";
import { getMain } from "../src/projects";
it("should have 0 observability", () => {
  const file = getSample("single-assignment-to-const");
  const observability = analyse(file);
  const files = observability.files;
  expect(observability.rating).toBe(0);
  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(0);
  expect(files[0].observables).toHaveLength(1);
  expect(files[0].observables[0]).toMatchObject({
    variable: {
      name: "a",
      lineNumber: 1,
      character: 5,
      sourceFile: file,
    },
    observed: false,
  });
  expect(files[0].file).toBe(file);
});

it("should have 1 observability when console logging all assigned variables", () => {
  const file = getSample("single-assignment-to-const-and-console-log");
  const observability = analyse(file);
  const files = observability.files;
  expect(observability.rating).toBe(1);
  expect(files[0].rating).toBe(1);
});

it("should have 0 observability when console logging none of the variables", () => {
  const file = getSample(
    "single-assignment-to-const-and-console-log-of-unrelated-const"
  );
  const files = analyse(file).files;
  expect(files[0].rating).toBe(0);
});

it("should have 0.5 observability when console logging only half of the variables", () => {
  const file = getSample(
    "two-assignment-to-const-and-console-log-of-one-of-them"
  );
  const files = analyse(file).files;
  expect(files[0].rating).toBe(0.5);
});

it("should calculate separate observabilities for each file", () => {
  const file = getSample("file-importing-another-module");
  const expectedModule = getSample("some-module");
  const files = analyse(file).files;
  expect(files).toHaveLength(2);
  expect(files[0].rating).toBe(1);
  expect(files[0].observables).toHaveLength(1);
  expect(files[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 1, sourceFile: expectedModule },
    observed: true,
  });
  expect(files[0].file).toBe(expectedModule);
  expect(files[1].rating).toBe(0.5);
  expect(files[1].observables).toHaveLength(2);
  expect(files[1].observables[0]).toMatchObject({
    variable: { name: "d", lineNumber: 4, sourceFile: file },
    observed: false,
  });
  expect(files[1].observables[1]).toMatchObject({
    variable: { name: "c", lineNumber: 3, sourceFile: file },
    observed: true,
  });
  expect(files[1].file).toBe(file);
});

it("should calculate observabilities for a whole project", () => {
  const projectDirectory = getSample("sample-project/");
  const main = getMain(projectDirectory);

  const files = analyse(main).files;

  expect(files).toHaveLength(3);
  expect(files[0].observables).toHaveLength(1);
  expect(files[1].observables).toHaveLength(1);
  expect(files[2].observables).toHaveLength(3);
});

it("should calculate observabilities for assignments in different scopes", () => {
  const file = getSample("two-assignments-in-different-scopes");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].observables).toHaveLength(2);
  expect(files[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 4, character: 7, sourceFile: file },
    observed: false,
  });
  expect(files[0].observables[1]).toMatchObject({
    variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
    observed: true,
  });
});

it("should recognise an observation from a child scope", () => {
  const file = getSample("observation-in-child-scope");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].observables).toHaveLength(1);
  expect(files[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
    observed: true,
  });
});

it("should recognise an observation from a nested child scope", () => {
  const file = getSample("observation-in-child-of-child-scope");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].observables).toHaveLength(1);
  expect(files[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
    observed: true,
  });
});

it("should ignore non-console-log function calls", () => {
  const file = getSample("observations-with-random-function-calls");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].observables).toHaveLength(1);
  expect(files[0].observables[0]).toMatchObject({
    variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
    observed: false,
  });
});

it("should have 0 observability for an empty file", () => {
  const file = getSample("empty-file");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(0);
  expect(files[0].observables).toHaveLength(0);
});

it("should be configurable to accept aliases of console.log", () => {
  const file = getSample("aliases-console-log");
  const files = analyse(file, { observers: ["alias"] }).files;

  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(0.5);
  expect(files[0].observables).toHaveLength(2);
});

it("should recognise the observation if part of string interpolation", () => {
  const file = getSample("string-interpolation");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(1);
  expect(files[0].observables).toHaveLength(1);
});

it("should recognise the observation if not the first part of string interpolation", () => {
  const file = getSample("not-first-part-of-string-interpolation");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(1);
  expect(files[0].observables).toHaveLength(1);
});

it("should not blow up if console logging some static info", () => {
  const file = getSample("console-log-static-info");
  const files = analyse(file).files;

  expect(files).toHaveLength(1);
  expect(files[0].rating).toBe(0);
  expect(files[0].observables).toHaveLength(1);
});
