import * as ts from "typescript";
import { SyntaxKind } from "typescript";

const fileNames = [`${process.cwd()}/sample.ts`];
const compilerOptions: ts.CompilerOptions = {
  // compiler options go here if any...
  // look at ts.CompilerOptions to see what's available
};
const program = ts.createProgram(fileNames, compilerOptions);
const typeChecker = program.getTypeChecker();
const sourceFiles = program.getSourceFiles();

function getChildren(child: ts.Declaration): Array<ts.Declaration> {
  const children = [];
  ts.forEachChild(child, (node) => {
    const declaration = node as ts.Declaration;
    children.push(declaration);
  });

  return children;
}

function flattenAllNodes(sourceFile) {
  const root = sourceFile as ts.Declaration;
  const allNodes = [root];
  const unexploredNodes = [root];
  let current = root;
  while (current) {
    const children = getChildren(current);
    allNodes.push(...children);
    unexploredNodes.push(...children);
    current = unexploredNodes.pop();
  }

  return allNodes;
}

sourceFiles
  .filter((f) => /sample\.ts$/.test(f.fileName))
  .forEach((sourceFile) => {
    const allNodes = flattenAllNodes(sourceFile);

    allNodes.forEach((node) => {
      if (node.kind === SyntaxKind.VariableDeclaration) {
        const copy = node;
        delete copy.parent;
        console.log(copy);
      }
    });
  });
