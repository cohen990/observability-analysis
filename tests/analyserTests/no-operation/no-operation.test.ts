import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("no operation", () => {
  const sample = (file) => getSample(file, `${path}/no-operation/`);

  it("should have 0 observability when console logging none of the variables", () => {
    const file = sample(
      "single-assignment-to-const-and-console-log-of-unrelated-const"
    );
    const files = analyse(file).files;
    expect(files[0].rating).toBe(0);
  });

  it("should ignore non-console-log function calls", () => {
    const file = sample("observations-with-random-function-calls");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: { name: "a", lineNumber: 1, character: 5, sourceFile: file },
      observed: false,
    });
  });

  it("should have NoRating observability for an empty file", () => {
    const file = sample("empty-file");
    const analysis = analyse(file);
    const files = analysis.files;

    expect(analysis.rating).toBe("NoRating");
    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe("NoRating");
    expect(files[0].observables).toHaveLength(0);
  });

  it("should not blow up if console logging some static info", () => {
    const file = sample("console-log-static-info");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(0);
    expect(files[0].observables).toHaveLength(1);
  });
});
