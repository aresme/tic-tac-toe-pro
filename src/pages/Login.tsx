import { useState } from "react";
import { User, Lock, LogIn } from "lucide-react";
import styles from "./Auth.module.css";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function Login({ onSwitchToRegister, onLoginSuccess }: { onSwitchToRegister: () => void, onLoginSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authLogin = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      authLogin(data.access_token, data.user);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}><LogIn size={28} /></div>
          <h2>Welcome Back</h2>
          <p>Tic-Tac-Toe Pro Multiplayer</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <Lock size={20} className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account? <button onClick={onSwitchToRegister} className={styles.linkBtn}>Sign up</button></p>
        </div>
      </div>
    </div>
  );
}
