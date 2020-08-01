import { flatten } from "../../src/syntaxTree";
import { getSample } from "../samples";
import { compile } from "../../src/compile";
import { isNotNodeModule } from "../../src/analyser";

describe("sytax tree", () => {
  const sample = (file) => getSample(file, "syntaxTree/");
  it("should flatten a syntax tree down to 7 declarations", () => {
    const fileName = sample("single-assignment-to-const");
    const compiled = compile(fileName);
    const flat = flatten(compiled.filter(isNotNodeModule)[0]);
    expect(flat.length).toBe(7);

    const scopeId = flat[0].scope;
    expect(scopeId).toBeDefined();
    expect(scopeId).not.toBe("");

    flat.forEach((x) => {
      expect(x.scope).toBe(scopeId);
    });
  });

  it("should assign different scopes", () => {
    const fileName = sample("two-assignments-in-different-scopes");
    const compiled = compile(fileName);
    const flat = flatten(compiled.filter(isNotNodeModule)[0]);
    expect(flat.length).toBe(21);

    let firstScope = flat[0].scope;
    let firstScopeCount = 0;
    let secondScopeCount = 0;

    flat.forEach((x) => {
      if (x.scope != firstScope) {
        secondScopeCount++;
      } else {
        firstScopeCount++;
      }
    });

    expect(firstScopeCount).toBe(15);
    expect(secondScopeCount).toBe(6);

    const nodesWithParents = flat.filter((x) => x.parentScope);

    expect(nodesWithParents).toHaveLength(6);
    nodesWithParents.forEach((x) => {
      expect(x.parentScope).toBe(firstScope);
    });
  });
});
