import { FunctionDeclaration, ParameterDeclaration } from "typescript";
import { Scoped } from "../../scope";
import { SyntaxNode } from "./syntaxNode";
import { ParameterNode } from "./parameterNode";

export class FunctionNode implements Scoped {
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

  getParameter(): ParameterNode {
    const declaration = this.typed().parameters[0] as ParameterDeclaration;
    return new ParameterNode(new SyntaxNode(declaration, this.node));
  }
}
