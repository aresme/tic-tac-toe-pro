import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvrSRTSptQt0gzEt-kMfd3cxXEUKaCGt0",
  authDomain: "tic-tier.firebaseapp.com",
  databaseURL: "https://tic-tier-default-rtdb.firebaseio.com",
  projectId: "tic-tier",
  storageBucket: "tic-tier.firebasestorage.app",
  messagingSenderId: "769779868257",
  appId: "1:769779868257:web:a9c849245be752b0b9c020"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Automatically sign in anonymously to satisfy security rules if user eventually turns them on.
signInAnonymously(auth).catch(console.error);

export { app };
