import { FunctionDeclaration, Identifier, SourceFile } from "typescript";
import { Scoped } from "../../scope";
import { SyntaxNode } from "./syntaxNode";

export class ParameterNode implements Scoped {
  private node: SyntaxNode;
  scope: string;
  parentScope?: string;

  constructor(node: SyntaxNode) {
    this.node = node;
    this.scope = node.scope;
    this.parentScope = node.parentScope;
  }

  private typed: () => FunctionDeclaration = () => {
    return this.node.base as FunctionDeclaration;
  };

  getName(): string {
    return (this.typed().name as Identifier).text;
  }

  getLine(source: SourceFile): number {
    return source.getLineAndCharacterOfPosition(this.typed().pos).line + 1;
  }

  getCharacter(source: SourceFile): number {
    return source.getLineAndCharacterOfPosition(this.typed().pos).character;
  }
}
