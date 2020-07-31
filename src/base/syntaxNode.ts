import {
  Declaration,
  SyntaxKind,
  CallExpression,
  VariableDeclaration,
  SourceFile,
} from "typescript";
import { v4 } from "uuid";
import { Scoped } from "./scope";

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

  isCallExpression: () => boolean = () => {
    return this.base.kind === SyntaxKind.CallExpression;
  };

  toObservation: () => ObservationNode = () => {
    return new ObservationNode(this);
  };

  isVariableDeclaration: () => boolean = () => {
    return this.base.kind === SyntaxKind.VariableDeclaration;
  };

  toVariable: () => VariableNode = () => {
    return new VariableNode(this);
  };

  nest: () => void = () => {
    this.parentScope = this.scope;
    this.scope = v4();
  };
}

export class ObservationNode implements Scoped {
  private node: SyntaxNode;
  scope: string;
  parentScope?: string;

  constructor(node: SyntaxNode) {
    this.node = node;
    this.scope = node.scope;
    this.parentScope = node.parentScope;
  }

  private typed: () => CallExpression = () => {
    return this.node.base as CallExpression;
  };

  isCalledWithAVariable: () => boolean = () => {
    return this.typed().arguments[0].kind === SyntaxKind.Identifier;
  };

  getName: () => string = () => {
    return (this.typed().arguments[0] as any).text;
  };
}

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
