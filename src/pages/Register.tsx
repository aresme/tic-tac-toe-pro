import { useState } from "react";
import { User, Lock, Mail, UserPlus } from "lucide-react";
import styles from "./Auth.module.css";
import { register } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function Register({ onSwitchToLogin, onRegisterSuccess }: { onSwitchToLogin: () => void, onRegisterSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authLogin = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(username, email, password);
      authLogin(data.access_token, data.user);
      onRegisterSuccess();
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
          <div className={styles.iconCircle}><UserPlus size={28} /></div>
          <h2>Create Account</h2>
          <p>Join the leaderboards</p>
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
            <Mail size={20} className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account? <button onClick={onSwitchToLogin} className={styles.linkBtn}>Login</button></p>
        </div>
      </div>
    </div>
  );
}
