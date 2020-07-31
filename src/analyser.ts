import { SourceFile } from "typescript";
import { flatten } from "./syntaxTree";
import { getObservables, Observable } from "./observables";
import { compile } from "./compile";
import { variableFrom } from "./base/variable";
import { observationFrom } from "./base/observation";
import { SyntaxNode, ObservationNode } from "./base/syntaxNode";
import { buildScope } from "./base/scope";

interface ObservabilityAnalysis {
  files: Array<FileObservability>;
  filesInspected: number;
  rating: number;
}

interface FileObservability {
  file: string;
  rating: number;
  observables: Array<Observable>;
}

interface AnalyserOptions {
  observers?: Array<string>;
}
const defaultObserver = "console.log";

export function analyse(
  target: string,
  options: AnalyserOptions = {}
): ObservabilityAnalysis {
  options.observers = options.observers || [];
  const observers = [...options.observers, defaultObserver];
  const compiled = compile(target);
  const libraryFiles = filterOutNodeModules(compiled);

  const analysed = libraryFiles.map((x) => analyseFile(x, observers));

  return {
    files: analysed,
    filesInspected: analysed.length,
    rating: averageRating(analysed),
  };
}

function analyseFile(
  file: SourceFile,
  observers: Array<string>
): FileObservability {
  const allNodes = flatten(file);

  const observations = allNodes
    .filter((x) => x.isObservation(observers))
    .map((x) => x.toObservation())
    .filter(isCalledWithAVariable)
    .map(observationFrom);

  const variables = allNodes
    .filter(isVariableDeclaration)
    .map((x) => x.toVariable())
    .map((x) => variableFrom(x, file));

  const scope = buildScope(allNodes);

  const observables = getObservables(variables, observations, scope);
  const observed = observables.filter((x) => x.observed).length;

  const rating =
    observables.length === 0
      ? observables.length
      : observed / observables.length;

  return {
    file: file.fileName,
    rating,
    observables,
  };
}

export function filterOutNodeModules(
  compiled: ReadonlyArray<SourceFile>
): ReadonlyArray<SourceFile> {
  return compiled.filter((f) => !/node_modules/.test(f.fileName));
}

function isCalledWithAVariable(node: ObservationNode): boolean {
  return node.isCalledWithAVariable();
}

function isVariableDeclaration(node: SyntaxNode): boolean {
  return node.isVariableDeclaration();
}

function averageRating(analysedFiles: Array<FileObservability>) {
  let runningTotal = 0;
  for (const file of analysedFiles) {
    runningTotal += file.rating;
  }

  return runningTotal / analysedFiles.length;
}
