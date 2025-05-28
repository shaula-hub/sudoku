// src/components/Board/Board.jsx
import React from "react";
import Cell from "./Cell";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function Board() {
  const { state } = useGame();
  const { board, givenCells, selectedCell, status } = state;

  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              isGiven={givenCells[rowIndex][colIndex]}
              isSelected={
                selectedCell.row === rowIndex && selectedCell.col === colIndex
              }
              isCompleted={status === "completed"}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
