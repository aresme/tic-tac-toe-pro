import { useState } from "react";
import { Users, ArrowRight, Shield } from "lucide-react";
import styles from "./RoomLobby.module.css";
import { useAuthStore } from "../store/authStore";

export default function RoomLobby({ onJoin, onBack }: { onJoin: (room: string) => void, onBack: () => void }) {
  const [roomCode, setRoomCode] = useState("");
  const { user } = useAuthStore();

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    onJoin(code);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length >= 3) {
      onJoin(roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}>Back to Menu</button>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}><Users size={32} /></div>
          <h2>Multiplayer</h2>
          <p>Play with friends online, {user?.username}!</p>
        </div>

        <div className={styles.section}>
          <button className={styles.actionBtn} onClick={handleCreate}>
            <Shield size={20} /> Create Private Room
          </button>
        </div>

        <div className={styles.divider}><span>OR</span></div>

        <form className={styles.section} onSubmit={handleJoin}>
          <label className={styles.label}>Join with a Code</label>
          <div className={styles.inputRow}>
            <input 
              type="text" 
              placeholder="e.g. A7F92" 
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button type="submit" disabled={roomCode.trim().length < 3}>
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
