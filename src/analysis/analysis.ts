import { Observable } from "../observables";

export type Rating = number | "NoRating";

export interface ObservabilityAnalysis {
  files: Array<FileObservability>;
  filesInspected: number;
  rating: Rating;
}

export interface FileObservability {
  file: string;
  rating: Rating;
  observables: Array<Observable>;
}

export function averageRating(analysedFiles: Array<FileObservability>): Rating {
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
