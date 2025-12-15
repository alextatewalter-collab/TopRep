export const GAMES = [
  { id: "speed_tap", name: "Speed Tap", description: "Click as many times as possible in 20 seconds." },
  { id: "endurance", name: "Endurance", description: "Survive as many rounds as possible. Score = streak." },
  { id: "word_lock", name: "Word Lock", description: "Write a caption under constraints. Score = rules passed + speed bonus." },
];

export function getGame(gameId) {
  return GAMES.find((g) => g.id === gameId);
}
