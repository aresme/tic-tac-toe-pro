import { Settings as SettingsIcon, Moon, Sun, Volume2, VolumeX, Trash2 } from "lucide-react";
import styles from "./Settings.module.css";
import { useGameSounds } from "../hooks/useSound";

interface Props {
  isDark: boolean;
  toggleTheme(): void;
  isSoundOn: boolean;
  toggleSound(): void;
  onResetScores(): void;
  onClearAllData(): void;
}

export default function Settings({ 
  isDark, toggleTheme, isSoundOn, toggleSound, onResetScores, onClearAllData 
}: Props) {
  const { click } = useGameSounds();

  const handleAction = (action: () => void) => {
    if (isSoundOn) click();
    action();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SettingsIcon className={styles.headerIcon} />
        <h2 className={styles.title}>Settings</h2>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Preferences</h3>
        
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <div className={styles.iconBox}>{isDark ? <Moon size={20} /> : <Sun size={20} />}</div>
            <span>Theme</span>
          </div>
          <button 
            className={styles.toggleBtn} 
            onClick={() => handleAction(toggleTheme)}
            data-active={isDark}
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <div className={styles.iconBox}>{isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}</div>
            <span>Sound</span>
          </div>
          <button 
            className={styles.toggleBtn} 
            onClick={() => handleAction(toggleSound)}
            data-active={isSoundOn}
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Data Management</h3>
        
        <button className={styles.actionBtn} onClick={() => handleAction(onResetScores)}>
          <RefreshCwIcon className={styles.actionIcon} />
          Reset Scores
        </button>
        
        <button className={`${styles.actionBtn} ${styles.dangerBtn}`} onClick={() => handleAction(onClearAllData)}>
          <Trash2 className={styles.actionIcon} />
          Clear Everything
        </button>
      </div>
    </div>
  );
}

function RefreshCwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
