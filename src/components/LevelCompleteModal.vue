<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="stars-container">
        <div 
          v-for="n in 3" 
          :key="n"
          class="star"
          :class="{ earned: n <= stars, pop: showAnimation }"
          :style="{ animationDelay: `${n * 0.2}s` }"
        >
          {{ n <= stars ? '⭐' : '☆' }}
        </div>
      </div>
      
      <h2>{{ getTitle() }}</h2>
      
      <div class="bonus-info">
        <div class="bonus-item">
          <span class="bonus-label">剩余时间</span>
          <span class="bonus-value">{{ timeBonus }}秒</span>
        </div>
        <div class="bonus-item">
          <span class="bonus-label">获得提示</span>
          <span class="bonus-value">+{{ stars }}🔍</span>
        </div>
      </div>
      
      <div class="buttons">
        <button class="btn-primary" @click="$emit('next')">
          <span>➡️</span> 下一关
        </button>

        <button class="btn-secondary" @click="$emit('retry')">
          <span>🔄</span> 再玩一次
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  stars: number;
  timeBonus: number;
}

const props = defineProps<Props>();
defineEmits(['next', 'retry']);

const showAnimation = ref(false);

onMounted(() => {
  setTimeout(() => {
    showAnimation.value = true;
  }, 100);
});

const getTitle = () => {
  if (props.stars === 3) return '🎉 完美侦破！';
  if (props.stars === 2) return '👏 表现出色！';
  return '✅ 案件解决！';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid rgba(212, 165, 116, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  min-width: 320px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.star {
  font-size: 3rem;
  color: #444;
  opacity: 0.3;
  transform: scale(0);
  transition: all 0.5s ease-out;
}

.star.earned {
  color: #fbbf24;
  opacity: 1;
  transform: scale(1);
  animation: starPop 0.6s ease-out;
}

.star.pop {
  transform: scale(1);
}

@keyframes starPop {
  0% { transform: scale(0) rotate(-180deg); }
  50% { transform: scale(1.3) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.modal-content h2 {
  color: #d4a574;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.bonus-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.bonus-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bonus-label {
  font-size: 0.8rem;
  color: #888;
}

.bonus-value {
  font-size: 1.2rem;
  color: #4ade80;
  font-weight: bold;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #d4a574, #b8956a);
  color: #1a1a2e;
  font-weight: bold;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(212, 165, 116, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 165, 116, 0.2);
  color: #d4a574;
}

.btn-secondary:hover {
  background: rgba(212, 165, 116, 0.1);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    padding: 2rem;
  }
  
  .star {
    font-size: 2.5rem;
  }
  
  .bonus-info {
    gap: 1rem;
  }
}
</style>
