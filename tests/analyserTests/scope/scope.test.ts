import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("scope", () => {
  const sample = (file) => getSample(file, `${path}/scope/`);

  it("should calculate observabilities for assignments in different scopes", () => {
    const file = sample("two-assignments-in-different-scopes");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].observables).toHaveLength(2);
    expect(files[0].observables[0]).toMatchObject({
      variable: {
        name: "scopeC",
        lineNumber: 4,
        character: 7,
        sourceFile: file,
      },
      observed: false,
    });
    expect(files[0].observables[1]).toMatchObject({
      variable: {
        name: "scopeC",
        lineNumber: 1,
        character: 5,
        sourceFile: file,
      },
      observed: true,
    });
  });

  it("should recognise an observation from a child scope", () => {
    const file = sample("observation-in-child-scope");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: {
        name: "scopeB",
        lineNumber: 1,
        character: 5,
        sourceFile: file,
      },
      observed: true,
    });
  });

  it("should recognise an observation from a nested child scope", () => {
    const file = sample("observation-in-child-of-child-scope");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: {
        name: "scopeA",
        lineNumber: 1,
        character: 5,
        sourceFile: file,
      },
      observed: true,
    });
  });
});
