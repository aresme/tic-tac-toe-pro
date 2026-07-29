const API_URL = "/api/users";

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Could not fetch profile");
  return response.json();
}

export async function getLeaderboard() {
  const response = await fetch(`${API_URL}/leaderboard`);
  if (!response.ok) throw new Error("Could not fetch leaderboard");
  return response.json();
}
