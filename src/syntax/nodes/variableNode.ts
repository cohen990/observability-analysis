import { VariableDeclaration, SourceFile, SyntaxKind } from "typescript";
import { Scoped } from "../../scope";
import { SyntaxNode } from "./syntaxNode";

export class VariableNode implements Scoped {
  private node: SyntaxNode;
  scope: string;
  parentScope?: string;

  constructor(node: SyntaxNode) {
    this.node = node;
    this.scope = node.scope;
    this.parentScope = node.parentScope;
  }

  private typed: () => VariableDeclaration = () => {
    return this.node.base as VariableDeclaration;
  };

  getName: () => string = () => {
    return (this.typed().name as any).text;
  };

  getLine: (sourceFile: SourceFile) => number = (sourceFile: SourceFile) => {
    return sourceFile.getLineAndCharacterOfPosition(this.typed().pos).line + 1;
  };

  getCharacter: (sourceFile: SourceFile) => number = (
    sourceFile: SourceFile
  ) => {
    return sourceFile.getLineAndCharacterOfPosition(this.typed().pos).character;
  };
}

export const isVariable = (node: SyntaxNode) => {
  return node.base.kind === SyntaxKind.VariableDeclaration;
};

export const toVariable = (node: SyntaxNode) => {
  return new VariableNode(node);
};
