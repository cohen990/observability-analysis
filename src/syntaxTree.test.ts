import { flatten } from "./syntaxTree";
import { getSample } from "./testSamples";
it("should flatten a syntax tree down to 7 declarations", () => {
  const input = getSample("single-assignment-to-const");
  const flat = flatten(input);
  expect(flat.length).toBe(7);
});
