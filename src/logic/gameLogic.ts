import type {
  CellValue,
  GameResult,
} from "../types/game";

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
] as const;

export function checkGame(
  board: CellValue[]
): GameResult {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        winner: board[a],
        winningCells: [...combination],
        isDraw: false,
      };
    }
  }

  const isDraw = board.every(
    (cell) => cell !== null
  );

  return {
    winner: null,
    winningCells: [],
    isDraw,
  };
}
