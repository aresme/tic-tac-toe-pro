import type {
  CellValue,
  Difficulty,
  Mark,
} from "../types/game";

import {
  checkGame,
} from "./gameLogic";

function getAvailableMoves(
  board: CellValue[]
): number[] {
  return board
    .map((cell, index) =>
      cell === null
        ? index
        : -1
    )
    .filter(
      (index) =>
        index !== -1
    );
}

function getRandomMove(
  board: CellValue[]
): number {
  const availableMoves =
    getAvailableMoves(board);

  const randomIndex =
    Math.floor(
      Math.random() *
      availableMoves.length
    );

  return (
    availableMoves[
      randomIndex
    ]
  );
}

function findWinningMove(
  board: CellValue[],
  player: Mark
): number | null {
  const availableMoves =
    getAvailableMoves(board);

  for (
    const move
    of availableMoves
  ) {
    const testBoard = [
      ...board,
    ];

    testBoard[move] =
      player;

    const result =
      checkGame(testBoard);

    if (
      result.winner ===
      player
    ) {
      return move;
    }
  }

  return null;
}

function getMediumMove(
  board: CellValue[],
  computer: Mark,
  human: Mark
): number {
  // Win if possible
  const winningMove =
    findWinningMove(
      board,
      computer
    );

  if (
    winningMove !== null
  ) {
    return winningMove;
  }

  // Block the player
  const blockingMove =
    findWinningMove(
      board,
      human
    );

  if (
    blockingMove !== null
  ) {
    return blockingMove;
  }

  // Take the center
  if (
    board[4] === null
  ) {
    return 4;
  }

  // Prefer corners
  const corners = [
    0,
    2,
    6,
    8,
  ].filter(
    (index) =>
      board[index] === null
  );

  if (
    corners.length > 0
  ) {
    return corners[
      Math.floor(
        Math.random() *
        corners.length
      )
    ];
  }

  return getRandomMove(
    board
  );
}

function minimax(
  board: CellValue[],
  isMaximizing: boolean,
  computer: Mark,
  human: Mark,
  depth: number
): number {
  const result =
    checkGame(board);

  if (
    result.winner ===
    computer
  ) {
    return 10 - depth;
  }

  if (
    result.winner ===
    human
  ) {
    return depth - 10;
  }

  if (
    result.isDraw
  ) {
    return 0;
  }

  const availableMoves =
    getAvailableMoves(board);

  if (
    isMaximizing
  ) {
    let bestScore =
      -Infinity;

    for (
      const move
      of availableMoves
    ) {
      const nextBoard = [
        ...board,
      ];

      nextBoard[move] =
        computer;

      const score =
        minimax(
          nextBoard,
          false,
          computer,
          human,
          depth + 1
        );

      bestScore =
        Math.max(
          score,
          bestScore
        );
    }

    return bestScore;
  }

  let bestScore =
    Infinity;

  for (
    const move
    of availableMoves
  ) {
    const nextBoard = [
      ...board,
    ];

    nextBoard[move] =
      human;

    const score =
      minimax(
        nextBoard,
        true,
        computer,
        human,
        depth + 1
      );

    bestScore =
      Math.min(
        score,
        bestScore
      );
  }

  return bestScore;
}

function getHardMove(
  board: CellValue[],
  computer: Mark,
  human: Mark
): number {
  const availableMoves = getAvailableMoves(board);

  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = computer;

    const score = minimax(nextBoard, false, computer, human, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export function getComputerMove(
  board: CellValue[],
  difficulty: Difficulty,
  computer: Mark = "O",
  human: Mark = "X"
): number {
  if (
    difficulty ===
    "easy"
  ) {
    return getRandomMove(
      board
    );
  }

  if (
    difficulty ===
    "medium"
  ) {
    return getMediumMove(
      board,
      computer,
      human
    );
  }

  return getHardMove(
    board,
    computer,
    human
  );
}
