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
