import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("function arguments", () => {
  const sample = (file) => getSample(file, `${path}/function-arguments/`);

  it("should recognise a function parameter as an observable", () => {
    const file = sample("simple-function");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(0);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: { name: "a", lineNumber: 1, sourceFile: file },
      observed: false,
    });
  });
});
