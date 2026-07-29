import styles from "./ResultModal.module.css";
import { Trophy, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameSounds } from "../hooks/useSound";

interface Props {
  message: string;
  isWin: boolean;
  onClose(): void;
  onRematch(): void;
}

export default function ResultModal({ message, isWin, onClose, onRematch }: Props) {
  const [mounted, setMounted] = useState(false);
  const { click } = useGameSounds();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = (action: () => void) => {
    click();
    action();
  };

  return (
    <div className={`${styles.overlay} ${mounted ? styles.mounted : ""}`}>
      <div className={styles.modal}>
        {/* Confetti container or decorative element would go here */}
        <div className={`${styles.iconWrapper} ${isWin ? styles.winIcon : styles.drawIcon}`}>
          {isWin ? <Trophy size={48} /> : <RefreshCw size={48} />}
        </div>
        
        <h2 className={styles.title}>{message}</h2>
        <p className={styles.subtitle}>
          {isWin ? "Outstanding gameplay!" : "It's a tough battle!"}
        </p>
        
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${styles.rematchBtn}`}
            onClick={() => handleAction(onRematch)}
          >
            <RefreshCw size={18} />
            Rematch
          </button>
          
          <button 
            className={`${styles.button} ${styles.closeBtn}`}
            onClick={() => handleAction(onClose)}
          >
            <X size={18} />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
