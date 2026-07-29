import useSound from "use-sound";

export function useGameSounds() {
  const [move] = useSound("/sounds/move.mp3");
  const [win] = useSound("/sounds/win.mp3");
  const [draw] = useSound("/sounds/draw.mp3");
  // Also adding click sound as requested in feature list "Button click sound"
  const [click] = useSound("/sounds/click.mp3");

  return { move, win, draw, click };
}
