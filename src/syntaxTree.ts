import { forEachChild, Declaration, SyntaxKind, SourceFile } from "typescript";
import { compile } from "./compile";

export function flatten(source: SourceFile): Array<Declaration> {
  return flattenAllNodes(source);
}

function flattenAllNodes(sourceFile) {
  const root = sourceFile as Declaration;
  const allNodes = [];
  const unexploredNodes = [];
  let current = root;
  while (current) {
    allNodes.push(current);
    const children = getChildren(current);
    unexploredNodes.push(...children);
    current = unexploredNodes.pop();
  }

  return allNodes;
}

function getChildren(child: Declaration): Array<Declaration> {
  const children = [];
  forEachChild(child, (node) => {
    const declaration = node as Declaration;
    children.push(declaration);
  });

  return children;
}
