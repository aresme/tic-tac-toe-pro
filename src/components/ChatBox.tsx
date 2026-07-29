import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import styles from "./ChatBox.module.css";
import { socketManager } from "../multiplayer/socket";

interface ChatMessage {
  player: string;
  text: string;
  isSystem?: boolean;
}

export default function ChatBox({ username }: { username: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = socketManager.subscribe((data) => {
      if (data.type === "CHAT") {
        setMessages(prev => [...prev, { player: data.player, text: data.text }]);
      }
      if (data.type === "SYSTEM") {
        setMessages(prev => [...prev, { player: "System", text: data.text, isSystem: true }]);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Optimistic UI
    setMessages(prev => [...prev, { player: username, text: input.trim() }]);
    
    // Broadcast via socketManager
    socketManager.send({ type: "CHAT", player: username, text: input.trim() });
    
    setInput("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWindow}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${msg.isSystem ? styles.sysMsg : msg.player === username ? styles.myMsg : styles.theirMsg}`}>
            {!msg.isSystem && <span className={styles.author}>{msg.player}</span>}
            <div className={styles.bubble}>{msg.text}</div>
          </div>
        ))}
        {messages.length === 0 && <div className={styles.empty}>Say hello!</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Send a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
