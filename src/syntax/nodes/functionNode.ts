import {
  FunctionDeclaration,
  ParameterDeclaration,
  SyntaxKind,
} from "typescript";
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

export const isFunctionWithParameters = (node: SyntaxNode) => {
  return isFunction(node) && hasParameters(node);
};

export const toFunction = (node: SyntaxNode) => {
  return new FunctionNode(node);
};

const isFunction = (node: SyntaxNode) => {
  return node.base.kind === SyntaxKind.FunctionDeclaration;
};

const hasParameters = (node: SyntaxNode) => {
  return (node.base as FunctionDeclaration).parameters.length > 0;
};
