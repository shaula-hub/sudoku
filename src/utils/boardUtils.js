// boardUtils.js
function isValidMove(board, row, col, value) {
  // Check row, column, and 3x3 box for conflicts
  return (
    isValidInRow(board, row, value) &&
    isValidInColumn(board, col, value) &&
    isValidInBox(board, row, col, value)
  );
}
