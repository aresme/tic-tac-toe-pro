import { Volume2, VolumeX } from "lucide-react";
import { useGameSounds } from "../hooks/useSound";

interface Props {
  isSoundOn: boolean;
  toggleSound(): void;
}

export default function SoundToggle({ isSoundOn, toggleSound }: Props) {
  const { click } = useGameSounds();

  const handleToggle = () => {
    if (!isSoundOn) click(); // Play sound when turning ON
    toggleSound();
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
        opacity: isSoundOn ? 1 : 0.6,
        transition: "opacity 0.2s"
      }}
      title={isSoundOn ? "Mute Sound" : "Enable Sound"}
    >
      {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
}
