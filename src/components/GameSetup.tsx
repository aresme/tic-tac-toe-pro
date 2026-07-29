import {
  Bot,
  ChevronRight,
  Users,
} from "lucide-react";

import type {
  Difficulty,
  GameMode,
} from "../types/game";

import styles
  from "./GameSetup.module.css";

interface GameSetupProps {
  mode: GameMode;
  difficulty: Difficulty;

  onModeChange: (
    mode: GameMode
  ) => void;

  onDifficultyChange: (
    difficulty: Difficulty
  ) => void;

  onStart: () => void;
}

export default function GameSetup({
  mode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  onStart,
}: GameSetupProps) {
  return (
    <main
      className={styles.page}
    >
      <section
        className={styles.card}
      >
        <div
          className={styles.icon}
        >
          <Bot size={34} />
        </div>

        <h1>
          Tic-Tac-Toe
        </h1>

        <p
          className={
            styles.subtitle
          }
        >
          Choose how you want
          to play
        </p>

        <div
          className={
            styles.section
          }
        >
          <h2>
            Game Mode
          </h2>

          <div
            className={
              styles.modeGrid
            }
          >
            <button
              type="button"
              className={[
                styles.modeButton,
                mode === "PVP"
                  ? styles.selected
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                onModeChange(
                  "PVP"
                )
              }
            >
              <Users
                size={28}
              />

              <strong>
                Two Players
              </strong>

              <span>
                Play with a
                friend
              </span>
            </button>

            <button
              type="button"
              className={[
                styles.modeButton,
                mode === "AI"
                  ? styles.selected
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                onModeChange(
                  "AI"
                )
              }
            >
              <Bot
                size={28}
              />

              <strong>
                Computer
              </strong>

              <span>
                Challenge the AI
              </span>
            </button>
          </div>
        </div>

        {mode === "AI" && (
          <div
            className={
              styles.section
            }
          >
            <h2>
              Difficulty
            </h2>

            <div
              className={
                styles.difficultyGrid
              }
            >
              {(
                [
                  "easy",
                  "medium",
                  "hard",
                ] as Difficulty[]
              ).map(
                (
                  level
                ) => (
                  <button
                    key={level}
                    type="button"
                    className={[
                      styles.difficulty,
                      difficulty === level ? styles.selectedDifficulty : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => onDifficultyChange(level)}
                  >
                    {level === "hard" ? "Extreme" : level}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          className={
            styles.startButton
          }
          onClick={
            onStart
          }
        >
          Start Game

          <ChevronRight
            size={21}
          />
        </button>
      </section>
    </main>
  );
}
