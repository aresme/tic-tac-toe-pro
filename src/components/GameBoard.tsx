import type {
  CellValue,
  Mark,
} from "../types/game";

import styles from "./GameBoard.module.css";

interface GameBoardProps {
  board: CellValue[];
  currentPlayer: Mark;
  winningCells: number[];
  disabled: boolean;
  isThinking: boolean;

  onCellClick: (index: number) => void;
}

export default function GameBoard({
  board,
  currentPlayer,
  winningCells,
  disabled,
  isThinking,
  onCellClick,
}: GameBoardProps) {
  return (
    <section
      className={styles.board}
      aria-label="Tic-Tac-Toe game board"
    >
      {isThinking && (
        <div
          className={
            styles.thinking
          }
        >
          Computer is thinking...
        </div>
      )}
      {board.map((cell, index) => {
        const isWinningCell =
          winningCells.includes(index);

        return (
          <button
            key={index}
            type="button"
            className={[
              styles.cell,
              cell === "X"
                ? styles.xCell
                : "",
              cell === "O"
                ? styles.oCell
                : "",
              isWinningCell
                ? styles.winningCell
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={
              disabled || isThinking || cell !== null
            }
            onClick={() =>
              onCellClick(index)
            }
            aria-label={
              cell
                ? `Cell ${index + 1}: ${cell}`
                : `Empty cell ${
                    index + 1
                  }. Player ${
                    currentPlayer
                  } can play here`
            }
          >
            {cell}
          </button>
        );
      })}
    </section>
  );
}
