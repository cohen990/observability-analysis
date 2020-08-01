import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("string interpolation", () => {
  const sample = (file) => getSample(file, `${path}/string-interpolation/`);

  it("should recognise the observation if part of string interpolation", () => {
    const file = sample("string-interpolation");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
  });

  it("should recognise the observation if not the first part of string interpolation", () => {
    const file = sample("not-first-part-of-string-interpolation");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(1);
  });

  it("should recognise multiple observations in a single string interpolation", () => {
    const file = sample("string-interpolation-with-multiple-observations");
    const files = analyse(file).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(1);
    expect(files[0].observables).toHaveLength(2);
  });
});
