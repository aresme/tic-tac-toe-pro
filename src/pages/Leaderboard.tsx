import { useEffect, useState } from "react";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { getLeaderboard } from "../api/users";
import styles from "./Leaderboard.module.css";

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard().then(setLeaders).catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}><ArrowLeft size={20} /> Back</button>
      <div className={styles.card}>
        <div className={styles.header}>
          <Trophy size={48} className={styles.headerIcon} />
          <h2>Global Ranks</h2>
          <p>Top Tic-Tac-Toe Players</p>
        </div>

        <div className={styles.list}>
          {leaders.map((user, i) => (
            <div key={user.username} className={styles.row}>
              <div className={styles.rank}>
                {i === 0 ? <Medal size={24} color="#f59e0b" /> : 
                 i === 1 ? <Medal size={24} color="#94a3b8" /> : 
                 i === 2 ? <Medal size={24} color="#b45309" /> : 
                 `#${i + 1}`}
              </div>
              <div className={styles.name}>{user.username}</div>
              <div className={styles.rating}>{user.rating}</div>
            </div>
          ))}
          {leaders.length === 0 && <div className={styles.empty}>No rated players yet...</div>}
        </div>
      </div>
    </div>
  );
}
