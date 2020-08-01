import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("basic fundamentals", () => {
  const sample = (file) => getSample(file, `${path}/basic-fundamentals/`);

  it("should have 1 observability when console logging all assigned variables", () => {
    const file = sample("single-assignment-to-const-and-console-log");
    const observability = analyse(file);
    const files = observability.files;
    expect(observability.rating).toBe(1);
    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
    expect(files[0].observables[0]).toMatchObject({
      variable: {
        name: "a",
        lineNumber: 1,
        character: 5,
        sourceFile: file,
      },
      observed: true,
    });
    expect(files[0].file).toBe(file);
  });

  it("should have 0.5 observability when console logging only half of the variables", () => {
    const file = sample(
      "two-assignment-to-const-and-console-log-of-one-of-them"
    );
    const files = analyse(file).files;
    expect(files[0].rating).toBe(0.5);
  });
});
