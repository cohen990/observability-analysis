import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { path } from "../directory";

describe("observers", () => {
  const sample = (file) => getSample(file, `${path}/observers/`);

  it("should be configurable to accept other observers", () => {
    const file = sample("other-observer");
    const files = analyse(file, { observers: ["observer"] }).files;

    expect(files).toHaveLength(1);
    expect(files[0].rating).toBe(0.5);
    expect(files[0].observables).toHaveLength(2);
  });
});
