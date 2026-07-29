import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, Settings as SettingsIcon, History as HistoryIcon, User } from "lucide-react";
import GameBoard from "./components/GameBoard";
import Scoreboard from "./components/Scoreboard";
import GameControls from "./components/GameControls";
import GameSetup from "./components/GameSetup";
import PlayerSetup from "./components/PlayerSetup";
import ResultModal from "./components/ResultModal";
import Settings from "./components/Settings";
import History, { type Match } from "./components/History";

import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import RoomLobby from "./components/RoomLobby";
import ChatBox from "./components/ChatBox";
import { getComputerMove } from "./logic/ai";
import { checkGame } from "./logic/gameLogic";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useGameSounds } from "./hooks/useSound";
import { useAuthStore } from "./store/authStore";
import { socketManager } from "./multiplayer/socket";
import type { CellValue, Difficulty, GameMode, Mark, Scores } from "./types/game";
import styles from "./App.module.css";

const EMPTY_BOARD: CellValue[] = Array(9).fill(null);
const INITIAL_SCORES: Scores = { X: 0, O: 0, draws: 0 };

export default function App() {
  const { user } = useAuthStore();
  
  // High level routing
  const [view, setView] = useState<"auth" | "menu" | "setup_players" | "game" | "profile" | "leaderboard" | "lobby" | "online_game">("menu");

  
  const [mode, setMode] = useState<GameMode>("PVP");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");

  const [board, setBoard] = useState<CellValue[]>(EMPTY_BOARD);
  const [boardHistory, setBoardHistory] = useState<CellValue[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Mark>("X");
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("Player X's turn");
  const [showResult, setShowResult] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Online Multiplayer State
  const [roomCode, setRoomCode] = useState<string>("");
  const [onlinePlayerMark, setOnlinePlayerMark] = useState<Mark>("X"); // Assigned when joining

  // Player Settings
  const [xName, setXName] = useLocalStorage("tic-tac-toe-xname", "Player X");
  const [oName, setOName] = useLocalStorage("tic-tac-toe-oname", "Player O");
  const [scores, setScores] = useLocalStorage<Scores>("tic-tac-toe-scores", INITIAL_SCORES);
  const [matchHistory, setMatchHistory] = useLocalStorage<Match[]>("tic-tac-toe-match-history", []);

  // Global Settings
  const [isDark, setIsDark] = useLocalStorage("tic-tac-toe-theme", false);
  const [isSoundOn, setIsSoundOn] = useLocalStorage("tic-tac-toe-sound", true);
  
  const sounds = useGameSounds();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  // Temporarily bypassing login requirement per user request
  /*
  useEffect(() => {
    if (!token && view !== "auth") {
      setView("auth");
    } else if (token && view === "auth") {
      setView("menu");
    }
  }, [token, view]);
  */

  // Handle Online Socket events
  useEffect(() => {
    if (view === "online_game") {
      const unsub = socketManager.subscribe((data) => {
        if (data.type === "MOVE") {
          handleSound("move");
          const newBoard = [...data.board];
          setBoardHistory(prev => [...prev, board]); // we probably don't use Undo in online
          setBoard(newBoard);
          finishGame(newBoard, true); // true = isOnline => don't allow undo
          setCurrentPlayer(data.nextPlayer);
          setMessage(`${data.nextPlayer === "X" ? xName : oName}'s turn`);
        } else if (data.type === "SYSTEM" && data.text.includes("joined")) {
           // We could assign marks properly via server. Simple approach for now.
           setMessage(data.text);
        }
      });
      return unsub;
    }
  }, [view, board]);

  function handleSound(type: "move" | "win" | "draw" | "click") {
    if (isSoundOn && sounds[type]) sounds[type]();
  }

  function finishGame(nextBoard: CellValue[], isOnline: boolean = false) {
    const result = checkGame(nextBoard);

    if (result.winner) {
      handleSound("win");
      setWinningCells(result.winningCells);
      setGameOver(true);
      setShowResult(true);
      
      const winnerName = result.winner === "X" ? xName : (mode === "AI" ? "Computer" : oName);
      setMessage(`${winnerName} wins!`);
      
      setScores(prev => ({ ...prev, [result.winner as Mark]: prev[result.winner as Mark] + 1 }));
      saveMatch(winnerName, isOnline ? "ONLINE" : mode);
      return true;
    }

    if (result.isDraw) {
      handleSound("draw");
      setGameOver(true);
      setShowResult(true);
      setMessage("The round is a draw!");
      
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      saveMatch("Draw", isOnline ? "ONLINE" : mode);
      return true;
    }
    return false;
  }

  function saveMatch(winner: string, matchMode: string) {
    const newMatch: Match = {
      winner,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      mode: matchMode
    };
    setMatchHistory(prev => [newMatch, ...prev].slice(0, 10));
  }

  function playMove(index: number, player: Mark) {
    handleSound("move");
    setBoardHistory(prev => [...prev, board]);
    
    const nextBoard = [...board];
    nextBoard[index] = player;
    setBoard(nextBoard);
    
    if (view === "online_game") {
      const nextP = player === "X" ? "O" : "X";
      socketManager.send({ type: "MOVE", board: nextBoard, nextPlayer: nextP });
    }
    
    return finishGame(nextBoard, view === "online_game");
  }

  function undoMove() {
    if (view === "online_game") return; // No undo in online
    if (boardHistory.length === 0 || gameOver) return;
    
    if (mode === "AI" && boardHistory.length >= 2) {
      const previous = boardHistory[boardHistory.length - 2];
      setBoard(previous);
      setBoardHistory(boardHistory.slice(0, -2));
      setCurrentPlayer("X");
      setMessage(`${xName}'s turn`);
    } else if (mode === "PVP") {
      const previous = boardHistory[boardHistory.length - 1];
      setBoard(previous);
      setBoardHistory(boardHistory.slice(0, -1));
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      setMessage(`${nextPlayer === "X" ? xName : oName}'s turn`);
    }
  }

  function handleCellClick(index: number) {
    if (board[index] !== null || gameOver || isThinking) return;

    // Online enforce turn
    if (view === "online_game" && currentPlayer !== onlinePlayerMark) return;

    // Local AI enforce turn
    if (view === "game" && mode === "AI" && currentPlayer === "O") return;

    const finished = playMove(index, currentPlayer);
    if (finished) return;

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);

    if (view === "game" && mode === "PVP") {
      setMessage(`${nextPlayer === "X" ? xName : oName}'s turn`);
      return;
    }

    if (view === "game" && mode === "AI") {
      setMessage("Computer is thinking...");
      setIsThinking(true);
    }
  }

  // Local AI move loop
  useEffect(() => {
    if (view !== "game" || mode !== "AI" || currentPlayer !== "O" || gameOver) return;

    const timer = window.setTimeout(() => {
      const moveIndex = getComputerMove(board, difficulty);
      const nextBoard = [...board];
      nextBoard[moveIndex] = "O";
      
      handleSound("move");
      setBoardHistory(prev => [...prev, board]);
      setBoard(nextBoard);

      const finished = finishGame(nextBoard, false);
      setIsThinking(false);

      if (!finished) {
        setCurrentPlayer("X");
        setMessage(`Your turn, ${xName}`);
      }
    }, 550);

    return () => window.clearTimeout(timer);
  }, [board, currentPlayer, difficulty, gameOver, view, mode]);

  function restartRound() {
    setBoard(Array(9).fill(null));
    setBoardHistory([]);
    setCurrentPlayer("X");
    setWinningCells([]);
    setGameOver(false);
    setShowResult(false);
    setIsThinking(false);
    setMessage(mode === "AI" ? `Your turn, ${xName}` : `${xName}'s turn`);
  }

  function resetScores() {
    setScores(INITIAL_SCORES);
    setMatchHistory([]);
    restartRound();
  }

  function returnToMenu() {
    handleSound("click");
    if (view === "online_game") {
      socketManager.disconnect();
    }
    setView("menu");
    setIsThinking(false);
  }

  const joinOnlineRoom = (code: string) => {
    handleSound("click");
    setRoomCode(code);
    socketManager.connect(code, (role) => {
      setOnlinePlayerMark(role);
      socketManager.send({ type: "SYSTEM", text: `A player joined the room as ${role}.` });
    });
    setMode("PVP"); // conceptually online is PVP
    setView("online_game");
    restartRound();
  };

  return (
    <main className={styles.appWrapper}>
      {/* Auth view removed per request, default to menu */}

      {view === "menu" && (
        <div className={styles.layout}>
           <div className={styles.topRightControls}>
             <button aria-label="Profile" className={styles.iconBtn} onClick={() => { handleSound("click"); setView("profile"); }}>
                {user?.avatar ? <img className={styles.avatarMini} src={user.avatar} alt="Profile" /> : <User size={24} />}
             </button>
             <button aria-label="Leaderboard" className={styles.iconBtn} onClick={() => { handleSound("click"); setView("leaderboard"); }}>
                <Trophy size={20} />
             </button>
             <button aria-label="History" className={styles.iconBtn} onClick={() => { handleSound("click"); setShowHistory(true); }}>
                <HistoryIcon size={24} />
             </button>
             <button aria-label="Settings" className={styles.iconBtn} onClick={() => { handleSound("click"); setShowSettings(true); }}>
                <SettingsIcon size={24} />
             </button>
           </div>
           
           <GameSetup
            mode={mode}
            difficulty={difficulty}
            onModeChange={(m) => { handleSound("click"); setMode(m); }}
            onDifficultyChange={(d) => { handleSound("click"); setDifficulty(d); }}
            onStart={() => { handleSound("click"); setView("setup_players"); }}
          />

          <div style={{ position: "absolute", bottom: "30px", left: "0", right: "0", display: "flex", justifyContent: "center" }}>
            <button className={styles.onlineBtn} onClick={() => { handleSound("click"); setView("lobby"); }}>
              Play Online With Friends
            </button>
          </div>
        </div>
      )}

      {view === "profile" && <Profile onBack={() => { handleSound("click"); setView("menu"); }} />}
      {view === "leaderboard" && <Leaderboard onBack={() => { handleSound("click"); setView("menu"); }} />}
      {view === "lobby" && <RoomLobby onJoin={joinOnlineRoom} onBack={() => { handleSound("click"); setView("menu"); }} />}

      {view === "setup_players" && (
        <PlayerSetup 
          isVsAI={mode === "AI"}
          onStart={(x, o) => {
            setXName(x || "Player X");
            setOName(o || "Player O");
            setView("game");
            restartRound();
          }}
        />
      )}

      {(view === "game" || view === "online_game") && (
        <section className={styles.game}>
          <button type="button" className={styles.backButton} onClick={returnToMenu}>
            <ArrowLeft size={19} /> Quit
          </button>

          <header className={styles.header}>
            <div className={styles.logo}><Trophy size={27} /></div>
            <div>
              <h1>Tic-Tac-Toe Pro</h1>
              <p>{view === "online_game" ? `Online Room: ${roomCode}` : mode === "AI" ? `Computer · ${difficulty === 'hard' ? 'Extreme' : difficulty}` : "Two Players"}</p>
            </div>
          </header>

          <Scoreboard scores={scores} />

          <section className={styles.statusCard}>
            <span className={styles.statusDot} style={{ background: view === "online_game" && currentPlayer !== onlinePlayerMark ? "#f43f5e" : "#10b981" }} />
            <p>{message}</p>
          </section>

          <GameBoard
            board={board}
            currentPlayer={currentPlayer}
            winningCells={winningCells}
            disabled={gameOver || (view === "online_game" && currentPlayer !== onlinePlayerMark)}
            isThinking={isThinking || (view === "online_game" && currentPlayer !== onlinePlayerMark)}
            onCellClick={handleCellClick}
          />

          {view === "game" && (
            <GameControls
              onRestart={() => { handleSound("click"); restartRound(); }}
              onResetScores={() => { handleSound("click"); resetScores(); }}
              onUndo={() => { handleSound("click"); undoMove(); }}
              undoDisabled={boardHistory.length === 0 || gameOver}
            />
          )}

          {view === "online_game" && (
            <ChatBox username={user?.username || "Guest"} />
          )}

          {showResult && (
            <ResultModal 
              message={message.replace(" wins!", " Won!").replace("The round is a draw!", "Draw!")} 
              isWin={!!winningCells.length} 
              onClose={() => { handleSound("click"); setShowResult(false); }} 
              onRematch={() => { handleSound("click"); restartRound(); }} 
            />
          )}
        </section>
      )}

      {/* Modals for Menu */}
      {showSettings && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModalBtn} onClick={() => { handleSound("click"); setShowSettings(false); }}>✕</button>
            <Settings 
              isDark={isDark} 
              toggleTheme={() => setIsDark(!isDark)} 
              isSoundOn={isSoundOn} 
              toggleSound={() => setIsSoundOn(!isSoundOn)} 
              onResetScores={() => { setScores(INITIAL_SCORES); setShowSettings(false); }} 
              onClearAllData={() => { localStorage.clear(); window.location.reload(); }} 
            />
          </div>
        </div>
      )}

      {showHistory && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModalBtn} onClick={() => { handleSound("click"); setShowHistory(false); }}>✕</button>
            <History history={matchHistory} onClear={() => setMatchHistory([])} />
          </div>
        </div>
      )}
    </main>
  );
}
