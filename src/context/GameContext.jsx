// Update to src/context/GameContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { generatePuzzle } from "../utils/sudokuGenerator";

const GameContext = createContext();

const initialState = {
  puzzle: Array(9)
    .fill()
    .map(() => Array(9).fill(0)),
  board: Array(9)
    .fill()
    .map(() => Array(9).fill(0)),
  solution: Array(9)
    .fill()
    .map(() => Array(9).fill(0)),
  givenCells: Array(9)
    .fill()
    .map(() => Array(9).fill(false)),
  selectedCell: { row: -1, col: -1 },
  status: "ready", // 'ready', 'playing', 'completed'
  difficulty: "beginner", // Changed from "standard" to "beginner"
  hints: {
    areaHighlight: false,
    technique: false,
    candidate: false,
  },
};

function gameReducer(state, action) {
  switch (action.type) {
    // Update the NEW_GAME case in gameReducer function in GameContext.jsx
    case "NEW_GAME": {
      const { puzzle, solution, givenCells } = generatePuzzle(
        action.difficulty,
        action.cellsToRemove // Make sure this is passed through
      );

      return {
        ...state,
        puzzle,
        board: JSON.parse(JSON.stringify(puzzle)), // Deep copy
        solution,
        givenCells,
        selectedCell: { row: -1, col: -1 },
        status: "playing",
        difficulty: action.difficulty || "beginner",
      };
    }

    case "UPDATE_HINTS": {
      return {
        ...state,
        hints: action.hints,
      };
    }

    case "SELECT_CELL": {
      return {
        ...state,
        selectedCell: { row: action.row, col: action.col },
      };
    }

    case "ENTER_NUMBER": {
      if (
        state.selectedCell.row === -1 ||
        state.givenCells[state.selectedCell.row][state.selectedCell.col]
      ) {
        return state;
      }

      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[state.selectedCell.row][state.selectedCell.col] = action.number;

      // Check if puzzle is completed
      const isComplete = checkBoardCompletion(newBoard, state.solution);

      return {
        ...state,
        board: newBoard,
        status: isComplete ? "completed" : "playing",
      };
    }

    case "CLEAR_CELL": {
      if (
        state.selectedCell.row === -1 ||
        state.givenCells[state.selectedCell.row][state.selectedCell.col]
      ) {
        return state;
      }

      const clearedBoard = JSON.parse(JSON.stringify(state.board));
      clearedBoard[state.selectedCell.row][state.selectedCell.col] = 0;

      return {
        ...state,
        board: clearedBoard,
      };
    }

    // Add this case to the gameReducer function in GameContext.jsx
    case "REFRESH_GAME": {
      // Force a complete refresh with current settings
      const { puzzle, solution, givenCells } = generatePuzzle(
        action.difficulty,
        action.cellsToRemove
      );

      return {
        ...state,
        puzzle,
        board: JSON.parse(JSON.stringify(puzzle)), // Deep copy
        solution,
        givenCells,
        selectedCell: { row: -1, col: -1 },
        status: "playing",
        difficulty: action.difficulty || state.difficulty,
      };
    }

    // Add this case to the gameReducer in GameContext.jsx
    case "RESET_GAME": {
      // Use current settings for reset, not defaults
      const currentDifficulty =
        action.difficulty || state.difficulty || "beginner";
      const { puzzle, solution, givenCells } = generatePuzzle(
        currentDifficulty,
        action.cellsToRemove
      );

      return {
        ...state,
        puzzle,
        board: JSON.parse(JSON.stringify(puzzle)),
        solution,
        givenCells,
        selectedCell: { row: -1, col: -1 },
        status: "playing",
        difficulty: currentDifficulty,
      };
    }

    default:
      return state;
  }
}

// Helper to check if board is complete and correct
function checkBoardCompletion(board, solution) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
