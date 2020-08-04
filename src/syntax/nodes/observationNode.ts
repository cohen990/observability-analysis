import {
  SyntaxKind,
  CallExpression,
  TemplateExpression,
  Identifier,
} from "typescript";
import { Scoped } from "../../scope";
import { SyntaxNode } from "./syntaxNode";

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

export const isObservation = (node: SyntaxNode, observers: Array<string>) => {
  if (node.base.kind !== SyntaxKind.CallExpression) {
    return false;
  }

  for (const observer of observers) {
    const [expressionText, expressionName] = getSingleDottedExpression(node);

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
      const expressionText = getNoDottedExpression(node);
      if (expressionText === observer) {
        return true;
      }
    }
  }

  return false;
};

export const toObservation = (node: SyntaxNode) => {
  return new ObservationNode(node);
};

const getSingleDottedExpression = (node: SyntaxNode) => {
  return [getExpressionText(node), getExpressionName(node)];
};

const getNoDottedExpression = (node: SyntaxNode) => {
  try {
    return ((node.base as CallExpression).expression as any).text;
  } catch {
    return undefined;
  }
};

const getExpressionText = (node: SyntaxNode) => {
  try {
    return (((node.base as CallExpression).expression as any).expression as any)
      .text;
  } catch {
    return undefined;
  }
};

const getExpressionName = (node: SyntaxNode) => {
  try {
    return (((node.base as CallExpression).expression as any).name as any).text;
  } catch {
    return undefined;
  }
};
