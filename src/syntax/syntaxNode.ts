import {
  Declaration,
  SyntaxKind,
  CallExpression,
  VariableDeclaration,
  SourceFile,
  TemplateExpression,
  Identifier,
} from "typescript";
import { v4 } from "uuid";
import { Scoped } from "../scope";

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
    return this.argumentIsIdentifier() || this.argumentIsTemplate();
  };

  getObserved: () => Array<string> = () => {
    if (this.argumentIsIdentifier())
      return (this.typed().arguments[0] as any).text;
    else {
      return (this.typed()
        .arguments[0] as TemplateExpression).templateSpans.map(
        (x) => (x.expression as Identifier).text
      );
    }
  };

  private argumentIsIdentifier() {
    return this.typed().arguments[0].kind === SyntaxKind.Identifier;
  }

  private argumentIsTemplate() {
    return this.typed().arguments[0].kind === SyntaxKind.TemplateExpression;
  }
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
