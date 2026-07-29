export type Mark = "X" | "O";

export type CellValue = Mark | null;

export type GameMode = "PVP" | "AI";

export type Difficulty =
  | "easy"
  | "medium"
  | "hard";

export interface GameResult {
  winner: Mark | null;
  winningCells: number[];
  isDraw: boolean;
}

export interface Scores {
  X: number;
  O: number;
  draws: number;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
}
