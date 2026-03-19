<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="stars">
        <span v-for="n in 3" :key="n" class="star" :class="{ active: n <= stars }">⭐</span>
      </div>
      
      <h2>案件侦破成功！🎉</h2>
      <p class="time-bonus">剩余时间: {{ timeBonus }}秒</p>
      
      <div class="buttons">
        <button class="btn-primary" @click="$emit('next')">
          下一关 ➡️
        </button>
        <button class="btn-secondary" @click="$emit('retry')">
          再玩一次 🔄
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const stars = computed(() => gameStore.levelStars[gameStore.currentLevel] || 1);
const timeBonus = computed(() => {
  // 这里应该从游戏逻辑传递，暂时模拟
  return 30;
});

defineEmits(['next', 'retry']);
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4a574;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stars {
  margin-bottom: 1rem;
}

.star {
  font-size: 2rem;
  opacity: 0.3;
  transition: all 0.3s;
}

.star.active {
  opacity: 1;
  animation: starPop 0.5s ease-out;
}

@keyframes starPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

h2 {
  color: #d4a574;
  margin-bottom: 0.5rem;
}

.time-bonus {
  color: #888;
  margin-bottom: 1.5rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #d4a574;
  color: #1a1a2e;
  font-weight: bold;
}

.btn-primary:hover {
  background: #e8c9a0;
  transform: scale(1.05);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #d4a574;
  color: #d4a574;
}

.btn-secondary:hover {
  background: rgba(212, 165, 116, 0.1);
}
</style>
