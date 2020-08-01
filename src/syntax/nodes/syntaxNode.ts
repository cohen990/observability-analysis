import {
  Declaration,
  SyntaxKind,
  CallExpression,
  FunctionDeclaration,
} from "typescript";
import { v4 } from "uuid";
import { Scoped } from "../../scope";
import { ObservationNode } from "../nodes/observationNode";
import { VariableNode } from "../nodes/variableNode";
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

  private getExpressionText() {
    try {
      return (((this.base as CallExpression).expression as any)
        .expression as any).text;
    } catch {
      return undefined;
    }
  }

  private getExpressionName() {
    try {
      return (((this.base as CallExpression).expression as any).name as any)
        .text;
    } catch {
      return undefined;
    }
  }

  private getSingleDottedExpression() {
    return [this.getExpressionText(), this.getExpressionName()];
  }

  private getNoDottedExpression() {
    try {
      return ((this.base as CallExpression).expression as any).text;
    } catch {
      return undefined;
    }
  }

  isObservation: (observers: Array<string>) => boolean = (
    observers: Array<string>
  ) => {
    if (this.base.kind !== SyntaxKind.CallExpression) {
      return false;
    }

    for (const observer of observers) {
      const [expressionText, expressionName] = this.getSingleDottedExpression();

      if (observer.indexOf(".") > 0) {
        const [observerExpressionText, observerExpressionName] = observer.split(
          "."
        );

        if (
          expressionText === observerExpressionText &&
          expressionName === observerExpressionName
        ) {
          return true;
        }
      } else {
        const expressionText = this.getNoDottedExpression();
        if (expressionText === observer) {
          return true;
        }
      }
    }

    return false;
  };

  toObservation: () => ObservationNode = () => {
    return new ObservationNode(this);
  };

  isVariable: () => boolean = () => {
    return this.base.kind === SyntaxKind.VariableDeclaration;
  };

  toVariable: () => VariableNode = () => {
    return new VariableNode(this);
  };

  isFunctionWithParameters: () => boolean = () => {
    return this.isFunction() && this.hasParameters();
  };

  toFunction: () => FunctionNode = () => {
    return new FunctionNode(this);
  };

  nest: () => void = () => {
    this.parentScope = this.scope;
    this.scope = v4();
  };

  private isFunction(): boolean {
    return this.base.kind === SyntaxKind.FunctionDeclaration;
  }

  private hasParameters(): boolean {
    return (this.base as FunctionDeclaration).parameters.length > 0;
  }
}
