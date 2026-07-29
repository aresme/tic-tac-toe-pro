import type {
  Scores,
} from "../types/game";

import styles from "./Scoreboard.module.css";

interface ScoreboardProps {
  scores: Scores;
}

export default function Scoreboard({
  scores,
}: ScoreboardProps) {
  return (
    <section
      className={styles.scoreboard}
      aria-label="Game scores"
    >
      <div className={styles.player}>
        <span className={styles.label}>
          Player X
        </span>

        <strong
          className={styles.xScore}
        >
          {scores.X}
        </strong>
      </div>

      <div className={styles.draws}>
        <span>Draws</span>

        <strong>
          {scores.draws}
        </strong>
      </div>

      <div className={styles.player}>
        <span className={styles.label}>
          Player O
        </span>

        <strong
          className={styles.oScore}
        >
          {scores.O}
        </strong>
      </div>
    </section>
  );
}
