export function createBoard(rows, cols, mineCount) {
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      });
    }
    board.push(row);
  }
  return board;
}

export function initializeMines(board, rows, cols, mineCount, firstRow, firstCol) {
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Ensure we don't place a mine on an existing mine, or on the first clicked cell
    if (!board[r][col].isMine && !(r === firstRow && col === firstCol)) {
      board[r][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (board[nr][nc].isMine) count++;
          }
        }
      }
      board[r][c].neighborMines = count;
    }
  }
}

export function revealCell(board, rows, cols, r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  const cell = board[r][c];
  if (cell.isRevealed || cell.isFlagged) return;

  cell.isRevealed = true;

  if (cell.neighborMines === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(board, rows, cols, r + dr, c + dc);
      }
    }
  }
}

export function checkWinCondition(board, rows, cols, mineCount) {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed) revealedCount++;
    }
  }
  return revealedCount === (rows * cols) - mineCount;
}

