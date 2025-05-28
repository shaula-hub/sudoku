// Update src/utils/sudokuGenerator.js
import { DIFFICULTY_RANGES } from "../config/difficultySettings";

// Generates a complete valid Sudoku solution
function generateSolution() {
  // Initialize empty 9x9 grid
  const grid = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  // Try to solve the empty grid (which will generate a valid solution)
  if (solveSudoku(grid)) {
    return grid;
  }

  // This shouldn't happen, but return empty grid as fallback
  return Array(9)
    .fill()
    .map(() => Array(9).fill(0));
}

// Backtracking algorithm to solve Sudoku
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Find empty cell
      if (grid[row][col] === 0) {
        // Try digits 1-9
        const nums = getRandomOrderedNumbers();
        for (const num of nums) {
          // Check if valid
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            // Recursively try to solve rest of grid
            if (solveSudoku(grid)) {
              return true;
            }

            // If we get here, we need to backtrack
            grid[row][col] = 0;
          }
        }
        return false; // Trigger backtracking
      }
    }
  }
  return true; // Grid is filled
}

// Helper to randomize number attempts for variety
function getRandomOrderedNumbers() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Shuffle using Fisher-Yates algorithm
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

// Check if number can be placed in position
function isValidPlacement(grid, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[boxRow + r][boxCol + c] === num) return false;
    }
  }

  return true;
}

// Create playable puzzle by removing numbers from solution
function createPuzzleFromSolution(solution, exactCellsToRemove) {
  const puzzle = JSON.parse(JSON.stringify(solution));
  const givenCells = Array(9)
    .fill()
    .map(() => Array(9).fill(true));

  // Create array of all possible cell positions
  const allPositions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allPositions.push({ row, col });
    }
  }

  // Shuffle the positions array to randomize which cells we remove
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Remove exactly the specified number of cells
  for (let i = 0; i < Math.min(exactCellsToRemove, 81); i++) {
    const { row, col } = allPositions[i];
    puzzle[row][col] = 0;
    givenCells[row][col] = false;
  }

  return { puzzle, givenCells };
}

export function generatePuzzle(
  difficulty = "beginner",
  exactCellsToRemove = null
) {
  const solution = generateSolution();

  let cellsToRemove;

  if (exactCellsToRemove !== null) {
    // Use the exact number provided by the slider
    cellsToRemove = exactCellsToRemove;
  } else {
    // Use the range-based approach for backward compatibility using centralized ranges
    const settings =
      DIFFICULTY_RANGES[difficulty] || DIFFICULTY_RANGES.beginner;
    cellsToRemove =
      Math.floor(Math.random() * (settings.max - settings.min + 1)) +
      settings.min;
  }

  const { puzzle, givenCells } = createPuzzleFromSolution(
    solution,
    cellsToRemove
  );

  return { puzzle, solution, givenCells };
}
