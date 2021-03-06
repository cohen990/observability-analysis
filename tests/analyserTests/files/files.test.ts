import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("files", () => {
  const sample = (file) => getSample(file, `${path}/files/`);

  it("should calculate separate observabilities for each file", () => {
    const file = sample("file-importing-another-module");
    const expectedModule = sample("some-module");
    const files = analyse(file).files;
    expect(files).toHaveLength(2);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: { name: "filesA", lineNumber: 1, sourceFile: expectedModule },
      observed: true,
    });
    expect(files[0].file).toBe(expectedModule);
    expect(files[1].rating).toBe(0.5);
    expect(files[1].observables).toHaveLength(2);
    expect(files[1].observables[0]).toMatchObject({
      variable: { name: "filesD", lineNumber: 4, sourceFile: file },
      observed: false,
    });
    expect(files[1].observables[1]).toMatchObject({
      variable: { name: "filesC", lineNumber: 3, sourceFile: file },
      observed: true,
    });
    expect(files[1].file).toBe(file);
  });

  it("should recognise an observation of a variable from a different file", () => {
    const file = sample("observed-in-a-different-file");
    const analysis = analyse(file);
    const files = analysis.files;

    expect(analysis.rating).toBe(1);
    expect(files).toHaveLength(2);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      observed: true,
      variable: {
        name: "filesA",
      },
    });
    expect(files[0].observables[0].variable.sourceFile).toContain(
      "some-module"
    );
  });

  xit("should recognise that an imported function is observing a variable", () => {
    const file = sample("observation-happening-in-imported-function");
    const analysis = analyse(file);
    const files = analysis.files;

    expect(analysis.rating).toBe(1);
    expect(files).toHaveLength(2);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      observed: true,
      variable: {
        name: "filesB",
      },
    });
    expect(files[0].observables[0].variable.sourceFile).toContain(
      "observer-module"
    );
  });
});
