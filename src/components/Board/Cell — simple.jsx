// src/components/Board/Cell.jsx
import React from "react";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function Cell({ value, isGiven, isSelected, row, col }) {
  const { dispatch } = useGame();

  // Determine which 3x3 box this cell belongs to (0-8)
  const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  const handleClick = () => {
    dispatch({ type: "SELECT_CELL", row, col });
  };

  // Apply different classes based on whether the number is given or entered by player
  const numberClass = isGiven ? "given" : "player";

  return (
    <div
      className={`
        cell 
        ${isSelected ? "selected" : ""}
        ${boxIndex % 2 === 0 ? "even-box" : "odd-box"}
      `}
      onClick={handleClick}
    >
      {value !== 0 ? <span className={numberClass}>{value}</span> : ""}
    </div>
  );
}

export default Cell;
