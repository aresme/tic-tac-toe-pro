import { User as UserIcon, Trophy, Swords, Medal, ArrowLeft } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Scores } from "../types/game";
import styles from "./Profile.module.css";

const INITIAL_SCORES: Scores = { X: 0, O: 0, draws: 0 };

export default function Profile({ onBack }: { onBack: () => void }) {
  const [xName, setXName] = useLocalStorage("tic-tac-toe-xname", "Player X");
  const [scores] = useLocalStorage<Scores>("tic-tac-toe-scores", INITIAL_SCORES);

  const totalGames = scores.X + scores.O + scores.draws;
  const winRate = totalGames === 0 ? 0 : Math.round((scores.X / totalGames) * 100);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}><ArrowLeft size={19} /> Back</button>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <UserIcon size={36} />
          </div>
          <h1>Player Profile</h1>
          <p className={styles.subtitle}>Set your multiplayer display name</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Display Name</label>
          <input 
            type="text" 
            className={styles.input}
            value={xName} 
            onChange={(e) => setXName(e.target.value)}
            placeholder="Enter your name..."
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <Swords size={22} className={styles.statIcon} />
            <span className={styles.statValue}>{totalGames}</span>
            <span className={styles.statLabel}>Games</span>
          </div>
          <div className={styles.statBox}>
            <Medal size={22} className={styles.statIcon} style={{color: "#e52529"}} />
            <span className={styles.statValue}>{scores.X}</span>
            <span className={styles.statLabel}>Wins</span>
          </div>
          <div className={styles.statBox}>
            <Trophy size={22} className={styles.statIcon} style={{color: "#f59e0b"}} />
            <span className={styles.statValue}>{winRate}%</span>
            <span className={styles.statLabel}>Win Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
