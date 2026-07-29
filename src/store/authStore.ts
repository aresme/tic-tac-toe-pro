import { create } from "zustand";

interface UserProfile {
  id: number;
  username: string;
  rating: number;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("tic-tac-toe-jwt"),
  user: JSON.parse(localStorage.getItem("tic-tac-toe-user") || "null"),
  login: (token, user) => {
    localStorage.setItem("tic-tac-toe-jwt", token);
    localStorage.setItem("tic-tac-toe-user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("tic-tac-toe-jwt");
    localStorage.removeItem("tic-tac-toe-user");
    set({ token: null, user: null });
  },
}));
