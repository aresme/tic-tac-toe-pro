export function calculateWinRate(wins: number, games: number) {
  if (games === 0) return 0;
  return Math.round((wins / games) * 100);
}
