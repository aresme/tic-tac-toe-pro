export interface Player {
  name: string;
  symbol: "X" | "O";
  avatar: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}
