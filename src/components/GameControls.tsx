import { RotateCcw, Trash2, Undo2 } from "lucide-react";
import styles from "./GameControls.module.css";

interface GameControlsProps {
  onRestart: () => void;
  onResetScores: () => void;
  onUndo: () => void;
  undoDisabled: boolean;
}

export default function GameControls({
  onRestart,
  onResetScores,
  onUndo,
  undoDisabled
}: GameControlsProps) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onRestart}
      >
        <RotateCcw size={20} />
        Restart Round
      </button>
      
      <div className={styles.secondaryGroup}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onUndo}
          disabled={undoDisabled}
        >
          <Undo2 size={18} />
          Undo
        </button>

        <button
          type="button"
          className={styles.dangerButton}
          onClick={onResetScores}
        >
          <Trash2 size={18} />
          Reset Scores
        </button>
      </div>
    </div>
  );
}
