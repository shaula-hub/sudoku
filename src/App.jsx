// Update App.jsx
import React, { useEffect, useState } from "react";
import Board from "./components/Board/Board";
import NumberPad from "./components/NumberPad/NumberPad";
import GameControls from "./components/Controls/GameControls";
import { GameProvider, useGame } from "./context/GameContext";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import "./styles/globals.css";

import VictoryModal from "./components/Victory/VictoryModal";
import "./styles/animations.css";

// Import centralized colors and ranges
import {
  getDifficultyColor,
  getDifficultyRange,
} from "./config/difficultySettings";

// Import new settings modal component
import SettingsModal from "./components/Settings/SettingsModal";

function GameInitializer() {
  const { dispatch } = useGame();

  // Use the keyboard input hook
  useKeyboardInput();

  useEffect(() => {
    // Start a new game with stored difficulty or 'beginner' as default
    const savedSettings = localStorage.getItem("sudokuSettings");
    let difficulty = "beginner";
    let cellsToRemove = null;

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      difficulty = parsedSettings.difficulty || "beginner";
      cellsToRemove = parsedSettings.cellsToRemove;
    }

    // Always pass cellsToRemove if available
    dispatch({
      type: "NEW_GAME",
      difficulty,
      cellsToRemove: cellsToRemove || undefined,
    });
  }, [dispatch]);

  return null;
}

function AppContent() {
  const { state } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentDifficultyColor = getDifficultyColor(state.difficulty);
  const getCurrentDifficultyName = () => {
    const range = getDifficultyRange(state.difficulty);
    return range ? range.label : "Beginner";
  };

  return (
    <div className="app-container" style={{ backgroundColor: "#6C10C0" }}>
      <div
        className="title-bar"
        style={{ backgroundColor: currentDifficultyColor }}
      >
        <h1
          className="game-title"
          style={
            isMobile
              ? {
                  fontSize: "1rem" /* Like new-game-button */,
                  fontWeight: "bold",
                  padding: "12px 20px",
                  border: `2px solid ${currentDifficultyColor}`,
                  borderRadius: "6px",
                  backgroundColor: currentDifficultyColor,
                }
              : {}
          }
        >
          <span className="title-main">Sudoku</span>
          <span className="title-separator">:</span>
          <span className="level-text">{getCurrentDifficultyName()}</span>
        </h1>
        <button
          id="settings-button"
          aria-label="Settings"
          onClick={() => setIsSettingsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="gear-icon"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>

      <GameInitializer />
      <GameControls
        difficultyColor={currentDifficultyColor}
        isMobile={isMobile}
      />
      <Board />
      <NumberPad />

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          currentDifficulty={state.difficulty}
        />
      )}

      {state.status === "completed" && <VictoryModal />}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
