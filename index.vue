<template>
  <div class="minesweeper-container">
    <!-- Header Controls -->
    <header class="game-header">
      <div class="header-title">
        <h1>Minesweeper</h1>
        <span class="status-badge" :class="gameState">● {{ gameStateText }}</span>
      </div>
      
      <!-- Stats Board Bar -->
      <div class="stats-bar">
        <div class="stat-box">
          <MinesweeperIcons type="flag" />
          <span class="stat-value">{{ remainingMines }}</span>
        </div>
        <button class="reset-btn" @click="resetGame">New Game</button>
        <div class="stat-box">
          <MinesweeperIcons type="clock" />
          <span class="stat-value">{{ timer }}s</span>
        </div>
      </div>

      <!-- Action Mode Selector for Mobile/Touch Interaction -->
      <div class="mode-selector">
        <button :class="{ active: interactionMode === 'reveal' }" @click="interactionMode = 'reveal'">
          Dig Mode
        </button>
        <button :class="{ active: interactionMode === 'flag' }" @click="interactionMode = 'flag'">
          Flag Mode
        </button>
      </div>
    </header>

    <!-- Main Dynamic Board Grid Wrapper -->
    <main class="board-wrapper">
      <div class="grid" :style="gridStyle">
        <div 
          v-for="row in board" 
          :key="row[0].row" 
          class="grid-row"
        >
          <button
            v-for="cell in row"
            :key="cell.col"
            class="cell"
            :class="{
              'revealed': cell.isRevealed,
              'flagged': cell.isFlagged,
              'has-mine': cell.isRevealed && cell.isMine,
              [`count-${cell.neighborMines}`]: cell.isRevealed && !cell.isMine && cell.neighborMines > 0
            }"
            @click="handleCellClick(cell)"
            @contextmenu.prevent="handleCellRightClick(cell)"
          >
            <!-- Render Contents depending on dynamic criteria configurations -->
            <template v-if="cell.isRevealed">
              <MinesweeperIcons v-if="cell.isMine" type="mine" />
              <span v-else-if="cell.neighborMines > 0">{{ cell.neighborMines }}</span>
            </template>
            <template v-else-if="cell.isFlagged">
              <MinesweeperIcons type="flag" />
            </template>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { createBoard, initializeMines, revealCell, checkWinCondition } from './lib/minesweeper.js';
import MinesweeperIcons from './components/MinesweeperIcons.vue';

// Matrix Configurations
const ROWS = 10;
const COLS = 8;
const TOTAL_MINES = 12;

// Local Component States
const board = ref([]);
const isFirstClick = ref(true);
const gameState = ref('ready'); // ready, playing, won, lost
const timer = ref(0);
const interactionMode = ref('reveal'); // reveal, flag
let timerInterval = null;

const gridStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
}));

const remainingMines = computed(() => {
  let flaggedCount = 0;
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell.isFlagged) flaggedCount++;
    });
  });
  return Math.max(0, TOTAL_MINES - flaggedCount);
});

const gameStateText = computed(() => {
  if (gameState.value === 'ready') return 'Ready';
  if (gameState.value === 'playing') return 'Active';
  if (gameState.value === 'won') return 'Victory';
  return 'Game Over';
});

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

function resetGame() {
  stopTimer();
  timer.value = 0;
  isFirstClick.value = true;
  gameState.value = 'ready';
  board.value = createBoard(ROWS, COLS, TOTAL_MINES);
}

function handleCellClick(cell) {
  if (gameState.value === 'won' || gameState.value === 'lost') return;
  
  // Mobile Action Mapping
  if (interactionMode.value === 'flag') {
    handleCellRightClick(cell);
    return;
  }

  if (cell.isFlagged || cell.isRevealed) return;

  if (isFirstClick.value) {
    isFirstClick.value = false;
    gameState.value = 'playing';
    initializeMines(board.value, ROWS, COLS, TOTAL_MINES, cell.row, cell.col);
    startTimer();
  }

  if (cell.isMine) {
    endGame(false);
    return;
  }

  revealCell(board.value, ROWS, COLS, cell.row, cell.col);

  if (checkWinCondition(board.value, ROWS, COLS, TOTAL_MINES)) {
    endGame(true);
  }
}

function handleCellRightClick(cell) {
  if (gameState.value === 'lost' || gameState.value === 'won' || cell.isRevealed) return;
  cell.isFlagged = !cell.isFlagged;
}

function endGame(isWin) {
  stopTimer();
  gameState.value = isWin ? 'won' : 'lost';
  
  // Expose every mine once the final evaluation process finishes
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell.isMine) cell.isRevealed = true;
    });
  });
}

// Instantiate state initially
resetGame();

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.minesweeper-container {
  min-height: 100vh;
  background-color: #0b0b0c; /* Matches custom black window theme background */
  color: #e3e3e6;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Header & Stat Configurations */
.game-header {
  margin-bottom: 20px;
}
.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header-title h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}
.status-badge {
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: #18181b;
  border: 1px solid #27272a;
}
.status-badge.ready { color: #a1a1aa; }
.status-badge.playing { color: #3b82f6; }
.status-badge.won { color: #22c55e; }
.status-badge.lost { color: #ef4444; }

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}
.stat-box {
  display: flex;
  align-items: center;
  gap: 6px;
}
.stat-value {
  font-size: 16px;
  font-weight: 600;
  font-family: monospace;
}
.reset-btn {
  background-color: #27272a;
  border: 1px solid #3f3f46;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.reset-btn:active {
  background-color: #3f3f46;
}

/* Toggle Switches */
.mode-selector {
  display: flex;
  background-color: #18181b;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid #27272a;
}
.mode-selector button {
  flex: 1;
  background: transparent;
  border: none;
  color: #a1a1aa;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
}
.mode-selector button.active {
  background-color: #27272a;
  color: #ffffff;
}

/* Board Structural Setup */
.board-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111113;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 12px;
}
.grid-row {
  display: flex;
  gap: 4px;
}

/* Interactive Board Cells */
.cell {
  width: 32px;
  height: 32px;
  background-color: #27272a;
  border: none;
  border-radius: 4px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  transition: background-color 0.1s ease;
}
.cell:active:not(.revealed) {
  background-color: #3f3f46;
}
.cell.revealed {
  background-color: #18181b;
  border: 1px solid #232326;
}
.cell.has-mine {
  background-color: #451a03;
}

/* Strategic color mappings for proximity indices */
.count-1 { color: #60a5fa; }
.count-2 { color: #4ade80; }
.count-3 { color: #f87171; }
.count-4 { color: #c084fc; }
.count-5 { color: #fb923c; }
.count-6 { color: #2dd4bf; }
</style>

