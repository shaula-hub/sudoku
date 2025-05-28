// src/components/NumberPad/NumberPad.jsx
import React from "react";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function NumberPad() {
  const { dispatch } = useGame();

  const handleNumberClick = (number) => {
    dispatch({ type: "ENTER_NUMBER", number });
  };

  const handleClearClick = () => {
    dispatch({ type: "CLEAR_CELL" });
  };

  return (
    <div className="number-pad">
      <div className="number-buttons">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="number-button"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <button className="clear-button" onClick={handleClearClick}>
        Clear
      </button>
    </div>
  );
}

export default NumberPad;
