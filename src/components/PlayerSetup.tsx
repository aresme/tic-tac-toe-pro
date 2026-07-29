import { useState } from "react";
import { User, Bot } from "lucide-react";
import styles from "./PlayerSetup.module.css";
import { useGameSounds } from "../hooks/useSound";

interface Props {
  onStart(playerX: string, playerO: string): void;
  isVsAI: boolean;
}

export default function PlayerSetup({ onStart, isVsAI }: Props) {
  const [xName, setXName] = useState("Player X");
  const [oName, setOName] = useState(isVsAI ? "Computer" : "Player O");
  const { click } = useGameSounds();

  const handleStart = () => {
    click();
    onStart(xName, oName);
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          {isVsAI ? <Bot size={48} className={styles.icon} /> : <User size={48} className={styles.icon} />}
        </div>
        
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.subtitle}>Let's set up the players!</p>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Player X (First to move)</label>
          <input
            className={styles.input}
            value={xName}
            onChange={e => setXName(e.target.value)}
            placeholder="Enter name..."
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Player O</label>
          <input
            className={styles.input}
            value={oName}
            onChange={e => setOName(e.target.value)}
            placeholder="Enter name..."
            disabled={isVsAI}
          />
        </div>
        
        <button className={styles.startButton} onClick={handleStart}>
          <span className={styles.buttonText}>Start Match</span>
        </button>
      </div>
    </section>
  );
}
