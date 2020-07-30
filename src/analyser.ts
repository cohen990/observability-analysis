import { SyntaxKind, CallExpression, Declaration } from "typescript";
import { flatten } from "./syntaxTree";

export class Analyser {
  analyseFile(target: string): number {
    let declarations = 0;
    let observations = 0;
    const allNodes = flatten(target);

    allNodes.forEach((node) => {
      if (this.isCallExpression(node)) {
        if (this.isCalledWithAVariable(node as CallExpression)) {
          observations += 1;
        }
      } else if (this.isVariableDeclaration(node)) {
        declarations += 1;
      }
    });

    return observations / declarations;
  }

  private isCalledWithAVariable(node: CallExpression): boolean {
    return node.arguments[0].kind === SyntaxKind.Identifier;
  }

  private isCallExpression(node: Declaration): boolean {
    return node.kind === SyntaxKind.CallExpression;
  }

  private isVariableDeclaration(node: Declaration): boolean {
    return node.kind === SyntaxKind.VariableDeclaration;
  }
}
