<template>
  <div ref="gameContainer" class="game-container">
    <!-- 加载中 -->
    <div v-if="!isLoaded" class="loading">
      <div class="loading-spinner">🔍</div>
      <div class="loading-text">正在加载案件档案...</div>
    </div>
    
    <!-- 游戏HUD -->
    <div v-if="isLoaded" class="hud">
      <div class="hud-left">
        <button class="hud-btn" @click="togglePause">
          {{ isPaused ? '▶️' : '⏸️' }}
        </button>
        <div class="level-info">
          <span class="level-name">关卡 {{ gameStore.currentLevel }}</span>
          <span class="level-title">{{ currentLevelData?.name }}</span>
        </div>
      </div>

      <div class="hud-center">
        <div class="timer" :class="{ warning: timeLeft <= 10, danger: timeLeft <= 5 }">
          ⏱️ {{ formatTime(timeLeft) }}
        </div>
      </div>

      <div class="hud-right">
        <div class="progress">
          <span class="found-count">{{ foundCount }}</span>
          <span class="total-count">/{{ currentLevelData?.diffCount || 5 }}</span>
        </div>
        
        <button class="hint-btn" @click="useHint" :disabled="gameStore.totalHints <= 0">
          <span class="hint-icon">🔍</span>
          <span class="hint-count">{{ gameStore.totalHints }}</span>
        </button>
      </div>
    </div>
    
    <!-- 游戏画布 -->
    <div ref="phaserContainer" class="phaser-container"></div>
    
    <!-- 暂停菜单 -->
    <PauseMenu
      v-if="isPaused"
      :found-count="foundCount"
      :total-count="currentLevelData?.diffCount || 5"
      :time-left="timeLeft"
      @resume="togglePause"
      @restart="restartLevel"
      @levels="goToLevelSelect"
      @quit="goToMenu"
    />
    
    <!-- 关卡完成弹窗 -->
    <LevelCompleteModal 
      v-if="showCompleteModal"
      :stars="earnedStars"
      :time-bonus="timeLeft"
      @next="nextLevel"
      @retry="restartLevel"
    />
    
    <!-- 关卡失败弹窗 -->
    <LevelFailedModal
      v-if="showFailedModal"
      @retry="restartLevel"
      @back="goToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { GameEngine } from '../game/GameEngine';
import { soundManager } from '../game/SoundManager';
import PauseMenu from './PauseMenu.vue';
import LevelCompleteModal from './LevelCompleteModal.vue';
import LevelFailedModal from './LevelFailedModal.vue';

const gameStore = useGameStore();

const gameContainer = ref<HTMLDivElement>();
const phaserContainer = ref<HTMLDivElement>();

const isLoaded = ref(false);
const isPaused = ref(false);
const timeLeft = ref(60);
const foundCount = ref(0);
const showCompleteModal = ref(false);
const showFailedModal = ref(false);
const earnedStars = ref(1);

let gameEngine: GameEngine | null = null;
let timerInterval: number | null = null;

const currentLevelData = gameStore.getCurrentLevel;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  timeLeft.value = currentLevelData.value?.timeLimit || 60;
  timerInterval = window.setInterval(() => {
    if (!isPaused.value && timeLeft.value > 0) {
      timeLeft.value--;
    } else if (timeLeft.value <= 0) {
      onTimeUp();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const onTimeUp = () => {
  stopTimer();
  soundManager.playGameOver();
  showFailedModal.value = true;
};

const onDifferenceFound = () => {
  if (isPaused.value) return;
  foundCount.value++;
  soundManager.playCorrect();
  
  if (foundCount.value >= (currentLevelData.value?.diffCount || 5)) {
    stopTimer();
    earnedStars.value = gameStore.completeLevel(timeLeft.value) || 1;
    soundManager.playLevelComplete();
    showCompleteModal.value = true;
  }
};

const onWrongClick = () => {
  if (isPaused.value) return;
  soundManager.playWrong();
  // 可以添加扣分逻辑
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  soundManager.playClick();
  if (isPaused.value) {
    gameStore.pauseGame();
  } else {
    gameStore.resumeGame();
  }
};

const useHint = () => {
  if (isPaused.value) return;
  if (gameStore.useHint() && gameEngine) {
    soundManager.playHint();
    gameEngine.showHint();
  }
};

const nextLevel = () => {
  soundManager.playClick();
  showCompleteModal.value = false;
  gameStore.nextLevel();
  loadLevel();
};

const restartLevel = () => {
  soundManager.playClick();
  showCompleteModal.value = false;
  showFailedModal.value = false;
  isPaused.value = false;
  loadLevel();
};

const goToLevelSelect = () => {
  soundManager.playClick();
  isPaused.value = false;
  gameStore.goToLevelSelect();
};

const goToMenu = () => {
  soundManager.playClick();
  isPaused.value = false;
  gameStore.goToMenu();
};

const loadLevel = () => {
  foundCount.value = 0;
  showCompleteModal.value = false;
  showFailedModal.value = false;
  
  if (gameEngine) {
    gameEngine.loadLevel(currentLevelData.value);
  }
  
  stopTimer();
  startTimer();
};

onMounted(() => {
  if (phaserContainer.value) {
    gameEngine = new GameEngine(phaserContainer.value, {
      onDifferenceFound,
      onWrongClick,
    });
    
    // 模拟加载延迟
    setTimeout(() => {
      isLoaded.value = true;
      loadLevel();
    }, 500);
  }
});

onUnmounted(() => {
  stopTimer();
  if (gameEngine) {
    gameEngine.destroy();
  }
});
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #0d0d1a;
  overflow: hidden;
}

/* 加载中 */
.loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #0d0d1a;
  z-index: 100;
  gap: 1rem;
}

.loading-spinner {
  font-size: 4rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #d4a574;
  font-size: 1.2rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* HUD */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1.5rem;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
}

.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hud-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: rgba(212, 165, 116, 0.2);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.hud-btn:hover {
  background: rgba(212, 165, 116, 0.3);
  transform: scale(1.05);
}

.level-info {
  display: flex;
  flex-direction: column;
}

.level-name {
  color: #d4a574;
  font-weight: bold;
  font-size: 0.9rem;
}

.level-title {
  color: #888;
  font-size: 0.75rem;
}

.timer {
  font-size: 1.5rem;
  color: #d4a574;
  font-weight: bold;
  font-family: monospace;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.timer.warning {
  color: #fbbf24;
  animation: blink 0.5s ease-in-out infinite;
}

.timer.danger {
  color: #ff4444;
  animation: blink 0.3s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.progress {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

.found-count {
  font-size: 1.3rem;
  color: #4ade80;
  font-weight: bold;
}

.total-count {
  font-size: 1rem;
  color: #888;
}

.hint-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #d4a574, #b8956a);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.hint-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.4);
}

.hint-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint-icon {
  font-size: 1rem;
}

.hint-count {
  font-size: 0.9rem;
  font-weight: bold;
  color: #1a1a2e;
  min-width: 20px;
  text-align: center;
}

/* 游戏画布 */
.phaser-container {
  width: 100%;
  height: 100%;
}

/* 响应式 */
@media (max-width: 768px) {
  .hud {
    padding: 0.5rem 1rem;
  }
  
  .timer {
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
  }
  
  .level-title {
    display: none;
  }
  
  .progress {
    padding: 0.4rem 0.8rem;
  }
  
  .found-count {
    font-size: 1.1rem;
  }
}
</style>
