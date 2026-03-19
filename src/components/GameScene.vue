<template>
  <div ref="gameContainer" class="game-container">
    <!-- 加载中 -->
    <div v-if="!isLoaded" class="loading">
      <div class="loading-text">正在加载案件档案...🔍</div>
    </div>
    
    <!-- 游戏HUD -->
    <div v-if="isLoaded" class="hud">
      <div class="hud-top">
        <div class="level-info">关卡 {{ gameStore.currentLevel }}/{{ gameStore.totalLevels }}</div>
        <div class="timer" :class="{ warning: timeLeft <= 10 }">
          ⏱️ {{ formatTime(timeLeft) }}
        </div>
        <button class="hint-btn" @click="useHint" :disabled="hints <= 0">
          🔍 提示({{ hints }})
        </button>
      </div>
      
      <div class="progress-bar">
        <div 
          v-for="n in currentLevelData?.diffCount || 5" 
          :key="n"
          class="progress-dot"
          :class="{ found: n <= foundCount }"
        />
      </div>
    </div>
    
    <!-- 游戏画布 -->
    <div ref="phaserContainer" class="phaser-container"></div>
    
    <!-- 关卡完成弹窗 -->
    <LevelCompleteModal 
      v-if="showCompleteModal"
      @next="nextLevel"
      @retry="retryLevel"
    />
    
    <!-- 关卡失败弹窗 -->
    <LevelFailedModal
      v-if="showFailedModal"
      @retry="retryLevel"
      @back="backToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { GameEngine } from '../game/GameEngine';
import LevelCompleteModal from './LevelCompleteModal.vue';
import LevelFailedModal from './LevelFailedModal.vue';

const gameContainer = ref<HTMLDivElement>();
const phaserContainer = ref<HTMLDivElement>();
const gameStore = useGameStore();

const isLoaded = ref(false);
const timeLeft = ref(60);
const hints = ref(3);
const foundCount = ref(0);
const showCompleteModal = ref(false);
const showFailedModal = ref(false);

let gameEngine: GameEngine | null = null;
let timerInterval: number | null = null;

const currentLevelData = computed(() => gameStore.getCurrentLevel());

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  timeLeft.value = currentLevelData.value?.timeLimit || 60;
  timerInterval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
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
  showFailedModal.value = true;
};

const onDifferenceFound = () => {
  foundCount.value++;
  if (foundCount.value >= (currentLevelData.value?.diffCount || 5)) {
    stopTimer();
    gameStore.completeLevel(timeLeft.value);
    showCompleteModal.value = true;
  }
};

const useHint = () => {
  if (hints.value > 0 && gameEngine) {
    hints.value--;
    gameEngine.showHint();
  }
};

const nextLevel = () => {
  showCompleteModal.value = false;
  gameStore.nextLevel();
  loadLevel();
};

const retryLevel = () => {
  showCompleteModal.value = false;
  showFailedModal.value = false;
  loadLevel();
};

const backToMenu = () => {
  showFailedModal.value = false;
  // TODO: 返回主菜单
};

const loadLevel = () => {
  foundCount.value = 0;
  if (gameEngine) {
    gameEngine.loadLevel(currentLevelData.value);
  }
  startTimer();
};

onMounted(() => {
  if (phaserContainer.value) {
    gameEngine = new GameEngine(phaserContainer.value, {
      onDifferenceFound,
      onWrongClick: () => { /* 错误点击反馈 */ }
    });
    
    // 模拟加载延迟
    setTimeout(() => {
      isLoaded.value = true;
      loadLevel();
    }, 1000);
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
}

.loading {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d0d1a;
  z-index: 100;
}

.loading-text {
  color: #d4a574;
  font-size: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
}

.hud-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.level-info, .timer {
  color: #d4a574;
  font-size: 1.1rem;
  font-weight: bold;
}

.timer.warning {
  color: #ff4444;
  animation: blink 0.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hint-btn {
  padding: 0.5rem 1rem;
  background: #d4a574;
  border: none;
  border-radius: 20px;
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.hint-btn:hover:not(:disabled) {
  background: #e8c9a0;
  transform: scale(1.05);
}

.hint-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #444;
  transition: all 0.3s;
}

.progress-dot.found {
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80;
}

.phaser-container {
  width: 100%;
  height: 100%;
}
</style>
