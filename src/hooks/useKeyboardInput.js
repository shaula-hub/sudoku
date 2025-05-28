// New hook: src/hooks/useKeyboardInput.js
import { useEffect } from "react";
import { useGame } from "../context/GameContext";

export function useKeyboardInput() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    function handleKeyDown(e) {
      // Only process if a cell is selected
      if (state.selectedCell.row === -1 || state.selectedCell.col === -1) {
        return;
      }

      // Check if the selected cell is a given cell (can't be modified)
      const { row, col } = state.selectedCell;
      if (state.givenCells[row][col]) {
        return;
      }

      // Handle number inputs (1-9)
      if (e.key >= "1" && e.key <= "9") {
        dispatch({ type: "ENTER_NUMBER", number: parseInt(e.key) });
      }

      // Handle deletion with Backspace, Delete, or 0
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        dispatch({ type: "CLEAR_CELL" });
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.selectedCell, state.givenCells, dispatch]);
}
