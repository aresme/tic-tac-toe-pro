import { Trophy, Clock, Swords } from "lucide-react";
import styles from "./History.module.css";
import { useGameSounds } from "../hooks/useSound";

export interface Match {
  winner: string; // 'X', 'O', 'Draw', or the Player's name
  date: string;
  mode: string; // 'PVP' or 'AI'
}

interface Props {
  history: Match[];
  onClear(): void;
}

export default function History({ history, onClear }: Props) {
  const { click } = useGameSounds();

  const handleClear = () => {
    click();
    onClear();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Games</h2>
        {history.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <Clock size={48} className={styles.emptyIcon} />
          <p>No games played yet</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {history.map((match, index) => (
            <li key={index} className={styles.listItem}>
              <div className={styles.iconContainer}>
                {match.winner === "Draw" ? (
                  <Swords className={styles.drawIcon} size={24} />
                ) : (
                  <Trophy className={styles.winIcon} size={24} />
                )}
              </div>
              <div className={styles.details}>
                <p className={styles.winnerText}>
                  {match.winner === "Draw" ? "Draw" : `${match.winner} won`}
                </p>
                <div className={styles.meta}>
                  <span className={styles.mode}>{match.mode}</span>
                  <span className={styles.date}>{match.date}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
