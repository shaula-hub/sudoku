// src/components/Controls/GameControls.jsx
import React from "react";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function GameControls({ difficultyColor, isMobile }) {
  const { dispatch, state } = useGame();

  const handleNewGame = () => {
    const savedSettings = localStorage.getItem("sudokuSettings");
    let difficulty = state.difficulty || "beginner";
    let cellsToRemove = null;

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      difficulty = parsedSettings.difficulty || state.difficulty || "beginner";
      cellsToRemove = parsedSettings.cellsToRemove;
    }

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
          backgroundColor: difficultyColor,
          borderColor: difficultyColor,
          ...(isMobile
            ? {
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
                padding: "8px 12px",
              }
            : {
                fontSize: "24px",
              }),
        }}
      >
        Новая игра
      </button>
    </div>
  );
}

export default GameControls;
