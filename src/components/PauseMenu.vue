<template>
  <div class="pause-menu">
    <div class="pause-content" @click.stop>
      <h2 class="pause-title">⏸️ 游戏暂停</h2>
      
      <div class="level-info">
        <div class="info-item">
          <span class="label">关卡</span>
          <span class="value">{{ levelName }}</span>
        </div>
        
        <div class="info-item">
          <span class="label">剩余时间</span>
          <span class="value time">{{ formatTime(timeLeft) }}</span>
        </div>
        
        <div class="info-item">
          <span class="label">已找到</span>
          <span class="value">{{ foundCount }}/{{ totalDifferences }}</span>
        </div>
      </div>
      
      <div class="pause-buttons">
        <button class="pause-btn btn-resume" @click="resume">
          <span class="icon">▶️</span>
          继续游戏
        </button>
        
        <button class="pause-btn btn-restart" @click="confirmRestart">
          <span class="icon">🔄</span>
          重新开始
        </button>
        
        <button class="pause-btn btn-levels" @click="confirmExit">
          <span class="icon">🗺️</span>
          关卡选择
        </button>
        
        <button class="pause-btn btn-menu" @click="confirmExitToMenu">
          <span class="icon">🏠</span>
          返回主菜单
        </button>
      </div>
      
      <!-- 音量控制 -->
      <div class="volume-control">
        <button class="mute-btn" @click="toggleMute">
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
      </div>
    </div>
    
    <!-- 确认弹窗 -->
    <div v-if="showConfirm" class="confirm-overlay" @click.self="cancelConfirm">
      <div class="confirm-dialog">
        <div class="confirm-icon">⚠️</div>
        
        <h3>{{ confirmTitle }}</h3>
        
        <p>{{ confirmMessage }}</p>
        
        <div class="confirm-buttons">
          <button class="btn-cancel" @click="cancelConfirm">取消</button>
          
          <button class="btn-confirm" @click="executeConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { soundManager } from '../game/SoundManager';

const props = defineProps<{
  levelName: string;
  timeLeft: number;
  foundCount: number;
  totalDifferences: number;
}>();

const emit = defineEmits<{
  resume: [];
  restart: [];
  exitToLevels: [];
  exitToMenu: [];
}>();

const gameStore = useGameStore();
const showConfirm = ref(false);
const confirmAction = ref<'exit' | 'menu' | 'restart' | null>(null);
const isMuted = ref(soundManager.getIsMuted());

const confirmTitle = computed(() => {
  switch (confirmAction.value) {
    case 'restart': return '重新开始？';
    case 'exit': return '退出到关卡选择？';
    case 'menu': return '返回主菜单？';
    default: return '';
  }
});

const confirmMessage = computed(() => {
  switch (confirmAction.value) {
    case 'restart': return '当前进度将丢失，确定要重新开始吗？';
    case 'exit': 
    case 'menu': return '当前游戏进度将丢失，确定要离开吗？';
    default: return '';
  }
});

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const resume = () => {
  soundManager.playClick();
  emit('resume');
};

const confirmRestart = () => {
  soundManager.playClick();
  confirmAction.value = 'restart';
  showConfirm.value = true;
};

const confirmExit = () => {
  soundManager.playClick();
  confirmAction.value = 'exit';
  showConfirm.value = true;
};

const confirmExitToMenu = () => {
  soundManager.playClick();
  confirmAction.value = 'menu';
  showConfirm.value = true;
};

const cancelConfirm = () => {
  soundManager.playClick();
  showConfirm.value = false;
  confirmAction.value = null;
};

const executeConfirm = () => {
  soundManager.playClick();
  showConfirm.value = false;
  
  switch (confirmAction.value) {
    case 'restart':
      emit('restart');
      break;
    case 'exit':
      emit('exitToLevels');
      break;
    case 'menu':
      emit('exitToMenu');
      break;
  }
  
  confirmAction.value = null;
};

const toggleMute = () => {
  isMuted.value = soundManager.toggleMute();
};
</script>

<style scoped>
.pause-menu {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pause-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(212, 165, 116, 0.2);
  border-radius: 24px;
  padding: 2rem;
  min-width: 300px;
  max-width: 90vw;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pause-title {
  text-align: center;
  color: #d4a574;
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
}

/* 关卡信息 */
.level-info {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #888;
  font-size: 0.9rem;
}

.value {
  color: #d4a574;
  font-weight: bold;
}

.value.time {
  color: #4ade80;
}

/* 按钮 */
.pause-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pause-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pause-btn:hover {
  transform: translateY(-2px);
}

.pause-btn .icon {
  font-size: 1.1rem;
}

.btn-resume {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0d0d1a;
  font-weight: bold;
}

.btn-restart {
  background: rgba(212, 165, 116, 0.15);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.3);
}

.btn-levels {
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-menu {
  background: transparent;
  color: #666;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 音量控制 */
.volume-control {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.mute-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mute-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 确认弹窗 */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.confirm-dialog {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(212, 165, 116, 0.2);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  max-width: 300px;
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.confirm-dialog h3 {
  color: #d4a574;
  margin: 0 0 0.5rem;
}

.confirm-dialog p {
  color: #888;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.confirm-buttons {
  display: flex;
  gap: 1rem;
}

.confirm-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.btn-confirm {
  background: #ff4444;
  color: white;
}

.confirm-buttons button:hover {
  transform: translateY(-2px);
}

/* 响应式 */
@media (max-width: 480px) {
  .pause-content {
    padding: 1.5rem;
    min-width: unset;
    width: calc(100% - 2rem);
  }
  
  .pause-title {
    font-size: 1.25rem;
  }
}
</style>
