// Update src/components/Controls/GameControls.jsx
import React from "react";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function GameControls({ difficultyColor }) {
  const { dispatch, state } = useGame();

  const handleNewGame = () => {
    // Get current settings from localStorage to maintain consistency
    const savedSettings = localStorage.getItem("sudokuSettings");
    let difficulty = state.difficulty || "beginner";
    let cellsToRemove = null;

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      difficulty = parsedSettings.difficulty || state.difficulty || "beginner";
      cellsToRemove = parsedSettings.cellsToRemove;
    }

    // Use current difficulty and settings, not defaults
    dispatch({
      type: "NEW_GAME",
      difficulty,
      cellsToRemove: cellsToRemove || undefined,
    });
  };

  return (
    <div className="game-controls">
      <button
        className="new-game-button"
        onClick={handleNewGame}
        style={{
          fontSize: 24,
          backgroundColor: difficultyColor,
          borderColor: difficultyColor,
        }}
      >
        Новая игра
      </button>
    </div>
  );
}

export default GameControls;
