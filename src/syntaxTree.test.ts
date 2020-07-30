import { flatten } from "./syntaxTree";
import { getSample } from "./testSamples";
import { compile } from "./compile";
import { filterOutNodeModules } from "./analyser";
it("should flatten a syntax tree down to 7 declarations", () => {
  const fileName = getSample("single-assignment-to-const");
  const compiled = compile(fileName);
  const flat = flatten(filterOutNodeModules(compiled)[0]);
  expect(flat.length).toBe(7);
});
