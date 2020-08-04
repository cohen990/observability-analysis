import { Declaration, SyntaxKind, FunctionDeclaration } from "typescript";
import { v4 } from "uuid";
import { Scoped } from "../../scope";
import { FunctionNode } from "../nodes/functionNode";

export class SyntaxNode implements Scoped {
  base: Declaration;
  scope: string;
  parentScope?: string;

  constructor(self: Declaration, parent?: SyntaxNode) {
    this.base = self;
    if (parent) {
      this.scope = parent.scope;
      this.parentScope = parent.parentScope;
    } else {
      this.scope = v4();
    }
  }

  isBlock: () => boolean = () => {
    return this.base.kind === SyntaxKind.Block;
  };

  nest: () => void = () => {
    this.parentScope = this.scope;
    this.scope = v4();
  };
}
