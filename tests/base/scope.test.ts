import { v4 } from "uuid";
import { buildScope } from "../../src/base/scope";
it("should build a single node scope", () => {
  const scope = buildScope([{ scope: v4() }]);

  expect(scope.nodes).toHaveLength(1);
  expect(scope.nodes[0].parent).toBeUndefined();
});

it("should build a single node scope given multiple scoped objects in same scope", () => {
  const scopeId = v4();
  const scope = buildScope([{ scope: scopeId }, { scope: scopeId }]);

  expect(scope.nodes).toHaveLength(1);
  expect(scope.nodes[0].id).toBe(scopeId);
  expect(scope.nodes[0].parent).toBeUndefined();
});

it("should build a two node scope given two scoped objects in different scopes", () => {
  const parent = v4();
  const child = v4();
  const scope = buildScope([
    { scope: parent },
    { scope: child, parentScope: parent },
  ]);

  expect(scope.nodes).toHaveLength(2);
  expect(scope.nodes[0]).toEqual({ id: parent, parent: undefined });
  expect(scope.nodes[1]).toEqual({ id: child, parent });
});

it("should build a four node scope given seven scoped objects in four different scopes", () => {
  const root = v4();
  const firstScope = v4();
  const secondScope = v4();
  const thirdScope = v4();
  const scope = buildScope([
    { scope: root },
    { scope: root },
    { scope: firstScope, parentScope: root },
    { scope: secondScope, parentScope: root },
    { scope: thirdScope, parentScope: secondScope },
    { scope: thirdScope, parentScope: secondScope },
    { scope: thirdScope, parentScope: secondScope },
  ]);

  expect(scope.nodes).toHaveLength(4);
  expect(scope.nodes[0]).toEqual({ id: root, parent: undefined });
  expect(scope.nodes[1]).toEqual({ id: firstScope, parent: root });
  expect(scope.nodes[2]).toEqual({ id: secondScope, parent: root });
  expect(scope.nodes[3]).toEqual({ id: thirdScope, parent: secondScope });
});

it("should know that a scope is in scope of self", () => {
  const self = v4();
  const scope = buildScope([{ scope: self }]);
  const isInScope = scope.isInScope(self, self);

  expect(isInScope).toBe(true);
});

it("should know that an unknown scope is not in scope", () => {
  const self = v4();
  const unknown = v4();
  const scope = buildScope([{ scope: self }]);
  const isInScope = scope.isInScope(unknown, self);

  expect(isInScope).toBe(false);
});

it("should know that a parent scope is not in the scope of the child", () => {
  const parent = v4();
  const child = v4();
  const scope = buildScope([
    { scope: parent },
    { scope: child, parentScope: parent },
  ]);
  const isInScope = scope.isInScope(parent, child);

  expect(isInScope).toBe(false);
});
