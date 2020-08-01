import { ObservabilityAnalysis, averageRating } from "./analysis/analysis";
import { analyseFile } from "./analysis/fileAnalyser";
import { compile, isNotNodeModule } from "./files";

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
