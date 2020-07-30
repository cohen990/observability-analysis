import {
  createProgram,
  forEachChild,
  Declaration,
  SyntaxKind,
} from "typescript";

export function flatten(target: string): Array<Declaration> {
  const program = createProgram([target], {});
  const sourceFiles = program.getSourceFiles();

  const targetFile = sourceFiles.filter(
    (f) => !/node_modules/.test(f.fileName)
  )[0];
  return flattenAllNodes(targetFile);
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
