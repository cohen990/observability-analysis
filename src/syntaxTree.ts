import { forEachChild, Declaration, SourceFile } from "typescript";
import { SyntaxNode } from "./base/syntaxNode";

export function flatten(source: SourceFile): Array<SyntaxNode> {
  return flattenAllNodes(source as Declaration);
}

function flattenAllNodes(sourceFile: Declaration): Array<SyntaxNode> {
  const root = new SyntaxNode(sourceFile);
  const allNodes: Array<SyntaxNode> = [];
  const unexploredNodes: Array<SyntaxNode> = [];
  let current = root;
  while (current) {
    allNodes.push(current);
    const children = getChildren(current);
    unexploredNodes.push(...children);
    current = unexploredNodes.pop();
  }

  return allNodes;
}

function getChildren(parent: SyntaxNode): Array<SyntaxNode> {
  const children: Array<SyntaxNode> = [];
  forEachChild(parent.base, (node) => {
    const child = new SyntaxNode(node as Declaration, parent);
    if (child.isBlock()) {
      child.nest();
    }
    children.push(child);
  });

  return children;
}
