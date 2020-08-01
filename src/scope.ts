export interface ScopeNode {
  id: string;
  parent?: string;
}

export class Scope {
  nodes: Array<ScopeNode>;

  constructor(nodes: Array<ScopeNode>) {
    this.nodes = nodes;
  }

  isInScope(child: string, possibleParent: string): boolean {
    if (child === possibleParent) {
      return true;
    }

    const node = this.nodeFor(child);
    if (!node) {
      return false;
    }

    return this.isChildOf(node, possibleParent);
  }

  private isChildOf(node: ScopeNode, possibleParentId: string) {
    let parent = this.nodeFor(node.parent);
    while (parent) {
      if (possibleParentId === parent.id) {
        return true;
      }
      parent = this.nodeFor(parent.parent);
    }

    return false;
  }

  private nodeFor(id: string) {
    if (!id) {
      return;
    }
    const matches = this.nodes.filter((x) => x.id === id);
    if (matches.length > 1) {
      throw new Error(
        "it shouldn't be possible to have multiple instances of the same scope"
      );
    }

    return matches[0];
  }
}

export interface Scoped {
  scope: string;
  parentScope?: string;
}

export const buildScope: (scoped: Array<Scoped>) => Scope = (
  scoped: Array<Scoped>
) => {
  const nodes = [];
  const found = {};
  scoped.forEach((x) => {
    if (!found[x.scope]) {
      found[x.scope] = true;
      nodes.push({ id: x.scope, parent: x.parentScope });
    }
  });
  return new Scope(nodes);
};
