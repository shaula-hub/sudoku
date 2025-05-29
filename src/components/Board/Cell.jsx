// src/components/Board/Cell.jsx
import React, { useRef } from "react";
import { useGame } from "../../context/GameContext";
import "./styles.css";

function Cell({ value, isGiven, isSelected, row, col, isCompleted }) {
  const { state, dispatch } = useGame();
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);

  // Determine which 3x3 box this cell belongs to (0-8)
  const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  const handleClick = () => {
    if (!isLongPress.current) {
      dispatch({ type: "SELECT_CELL", row, col });
    }
    isLongPress.current = false;
  };

  // Handle long press for hint display
  const handleMouseDown = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      showHints();
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchStart = (e) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      showHints();
    }, 500);
  };

  const handleTouchEnd = (e) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (isLongPress.current) {
      e.preventDefault(); // Prevent click event
    }
  };

  // Show hints based on enabled settings
  const showHints = () => {
    if (
      !state.hints.areaHighlight &&
      !state.hints.technique &&
      !state.hints.candidate
    ) {
      return; // No hints enabled
    }

    // Area Highlight Hint - handled in CSS via class addition
    if (state.hints.areaHighlight) {
      highlightRelatedCells(row, col);
    }

    // Check if both technique and candidate hints are enabled
    if (state.hints.technique && state.hints.candidate) {
      showCombinedTooltip(row, col);
    } else {
      // Show individual tooltips
      if (state.hints.technique) {
        showTechniqueHint(row, col);
      }

      if (state.hints.candidate) {
        showCandidateHint(row, col);
      }
    }
  };

  // Highlight related cells (same row, column, box)
  const highlightRelatedCells = (row, col) => {
    const cells = document.querySelectorAll(".cell");

    // Reset all highlights first
    cells.forEach((cell) => cell.classList.remove("hint-highlight"));

    cells.forEach((cell) => {
      const cellRow = parseInt(cell.getAttribute("data-row"));
      const cellCol = parseInt(cell.getAttribute("data-col"));

      // Same row, column, or 3x3 box
      if (
        cellRow === row ||
        cellCol === col ||
        (Math.floor(cellRow / 3) === Math.floor(row / 3) &&
          Math.floor(cellCol / 3) === Math.floor(col / 3))
      ) {
        cell.classList.add("hint-highlight");
      }
    });

    // Remove highlight after 2 seconds
    setTimeout(() => {
      cells.forEach((cell) => cell.classList.remove("hint-highlight"));
    }, 2000);
  };

  // New function to show combined tooltip
  const showCombinedTooltip = (row, col) => {
    const techniqueText = getTechniqueText(row, col);
    const candidates = findCandidates(row, col);

    let tooltipContent = "";

    // Add technique hint first
    if (techniqueText) {
      tooltipContent += techniqueText;
    }

    // Add empty row separator and candidate hint
    if (candidates.length > 0) {
      if (tooltipContent) {
        tooltipContent += "\n\n"; // Empty row separator
      }
      tooltipContent += `Candidates: ${candidates.join(", ")}`;
    }

    if (tooltipContent) {
      const tooltip = document.createElement("div");
      tooltip.className = "hint-tooltip combined";

      // Use pre-line to preserve line breaks
      tooltip.style.whiteSpace = "pre-line";
      tooltip.textContent = tooltipContent;

      document.body.appendChild(tooltip);

      // Position near the cell
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      if (cell) {
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
      }

      // Remove after 4 seconds (longer for combined tooltip)
      setTimeout(() => {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      }, 4000);
    }
  };

  // Extract technique logic into separate function
  const getTechniqueText = (row, col) => {
    // This would implement actual technique suggestion logic
    // For now, return a simple technique suggestion
    return "Постарайтесь найти одну пустую ячнейку в строке";
  };

  // Show technique hint tooltip
  const showTechniqueHint = (row, col) => {
    const techniqueText = getTechniqueText(row, col);

    if (techniqueText) {
      const tooltip = document.createElement("div");
      tooltip.className = "hint-tooltip technique";
      tooltip.textContent = techniqueText;

      document.body.appendChild(tooltip);

      // Position near the cell
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      if (cell) {
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
      }

      // Remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      }, 3000);
    }
  };

  // Show candidate numbers tooltip
  const showCandidateHint = (row, col) => {
    const candidates = findCandidates(row, col);

    if (candidates.length > 0) {
      const tooltip = document.createElement("div");
      tooltip.className = "hint-tooltip candidates";
      tooltip.style.whiteSpace = "pre-line";
      tooltip.textContent = `Кандидат(ы):\n\n${candidates.join(", ")}`;

      document.body.appendChild(tooltip);

      // Center relative to sudoku board (both horizontally and vertically)
      const board = document.querySelector(".sudoku-board");
      if (board) {
        const boardRect = board.getBoundingClientRect();
        tooltip.style.left = `${
          boardRect.left +
          boardRect.width / 2 -
          tooltip.offsetWidth / 2 +
          window.scrollX
        }px`;
        tooltip.style.top = `${
          boardRect.top +
          boardRect.height / 2 -
          tooltip.offsetHeight / 2 +
          window.scrollY
        }px`;
      }

      // Remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      }, 3000);
    }
  };

  // Find valid candidates for a cell
  const findCandidates = (row, col) => {
    if (state.board[row][col] !== 0) {
      return []; // Cell already has a value
    }

    const candidates = [];

    for (let num = 1; num <= 9; num++) {
      if (isValidCandidate(state.board, row, col, num)) {
        candidates.push(num);
      }
    }

    return candidates;
  };

  // Check if a number can be a candidate for a cell
  const isValidCandidate = (board, row, col, num) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === num) return false;
      }
    }

    return true;
  };

  return (
    <div
      className={`
        cell 
        ${isGiven ? "given" : ""} 
        ${isSelected ? "selected" : ""}
        ${boxIndex % 2 === 0 ? "even-box" : "odd-box"}
        ${isCompleted ? "solved-cell" : ""}
      `}
      style={
        isCompleted ? { animationDelay: `${(row * 9 + col) * 0.03}s` } : {}
      }
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-row={row}
      data-col={col}
    >
      {value !== 0 ? (
        <span className={isGiven ? "given" : "player"}>{value}</span>
      ) : (
        ""
      )}
    </div>
  );
}

export default Cell;
