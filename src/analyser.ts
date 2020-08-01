import { SourceFile } from "typescript";
import { flatten } from "./syntaxTree";
import { getObservables, Observable } from "./observables";
import { compile } from "./compile";
import { variableFrom } from "./base/variable";
import { observationFrom } from "./base/observation";
import { SyntaxNode, ObservationNode } from "./base/syntaxNode";
import { buildScope } from "./base/scope";

type Rating = number | "NoRating";

interface ObservabilityAnalysis {
  files: Array<FileObservability>;
  filesInspected: number;
  rating: Rating;
}

interface FileObservability {
  file: string;
  rating: Rating;
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
  const libraryFiles = compiled.filter(isNotNodeModule);

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
    observables.length === 0 ? "NoRating" : observed / observables.length;

  return {
    file: file.fileName,
    rating,
    observables,
  };
}

export function isNotNodeModule(file: SourceFile): boolean {
  return !/node_modules/.test(file.fileName);
}

function isCalledWithAVariable(node: ObservationNode): boolean {
  return node.isCalledWithAVariable();
}

function isVariableDeclaration(node: SyntaxNode): boolean {
  return node.isVariableDeclaration();
}

function averageRating(analysedFiles: Array<FileObservability>): Rating {
  const ratedFiles = analysedFiles.filter(isRated);
  if (ratedFiles.length === 0) {
    return "NoRating";
  }

  const totalRating = ratedFiles.map(getRating).reduce(addTogether, 0);

  return totalRating / ratedFiles.length;
}

function isRated(observability: FileObservability): boolean {
  return observability.rating !== "NoRating";
}

function getRating(observability: FileObservability): number {
  return observability.rating as number;
}

function addTogether(first: number, second: number): number {
  return first + second;
}
