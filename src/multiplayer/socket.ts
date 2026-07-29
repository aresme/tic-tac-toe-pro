import { db } from "../lib/firebase";
import { ref, push, onChildAdded, off, runTransaction, type DatabaseReference, onDisconnect } from "firebase/database";

type MessageCallback = (data: any) => void;

class SocketManager {
  private listeners: Set<MessageCallback> = new Set();
  private messagesRef: DatabaseReference | null = null;
  private myPushIds: Set<string> = new Set();
  
  connect(room: string, onConnect?: (role: "X" | "O") => void) {
    this.disconnect();
    
    this.messagesRef = ref(db, `rooms/${room}/events`);
    
    // Assign "X" if first, "O" if second
    const countRef = ref(db, `rooms/${room}/playerCount`);
    runTransaction(countRef, (currentData) => {
      if (currentData === null || currentData === undefined) return 1;
      return currentData + 1;
    }).then((result) => {
      const val = result.snapshot.val();
      const role = val <= 1 ? "X" : "O";
      if (onConnect) onConnect(role);
      
      onDisconnect(countRef).set(val - 1);
    }).catch(console.error);

    onChildAdded(this.messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.__senderId && this.myPushIds.has(data.__senderId)) {
        // Ignore events we pushed ourselves since UI is optimistic
        return;
      }
      this.listeners.forEach(cb => cb(data));
    });
  }
  
  subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  }
  
  send(payload: any) {
    if (this.messagesRef) {
      const id = Math.random().toString(36).substr(2, 9);
      this.myPushIds.add(id);
      push(this.messagesRef, { ...payload, __senderId: id });
    }
  }
  
  disconnect() {
    if (this.messagesRef) off(this.messagesRef);
    this.messagesRef = null;
    this.listeners.clear();
  }
}

export const socketManager = new SocketManager();
