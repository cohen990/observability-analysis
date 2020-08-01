import { analyse } from "../../../src/analyser";
import { getSample } from "../../samples";
import { getMain } from "../../../src/projects";
import { path } from "../directory";

describe("projects", () => {
  const sample = (file) => getSample(file, `${path}/projects/`);

  it("should calculate observabilities for a whole project", () => {
    const projectDirectory = sample("sample-project/");
    const main = getMain(projectDirectory);

    const files = analyse(main).files;

    expect(files).toHaveLength(3);
    expect(files[0].observables).toHaveLength(1);
    expect(files[1].observables).toHaveLength(1);
    expect(files[2].observables).toHaveLength(3);
  });
});
