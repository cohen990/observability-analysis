import { flatten } from "./syntaxTree";
it("should flatten a syntax tree down to 7 declarations", () => {
  const input = `${process.cwd()}/samples/single-assignment-to-const.ts`;
  const flat = flatten(input);
  expect(flat.length).toBe(7);
});
