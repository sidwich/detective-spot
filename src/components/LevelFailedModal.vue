<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="fail-icon">😅</div>
      
      <h2>时间到！</h2>
      
      <p class="message">别气馁，再仔细观察一下~🔍</p>
      
      <div class="tip-box">
        <div class="tip-icon">💡</div>
        <p>提示：使用 🔍 按钮可以获得线索！</p>
      </div>
      
      <div class="buttons">
        <button class="btn-primary" @click="$emit('retry')">
          <span>💪</span> 再试一次
        </button>

        <button class="btn-secondary" @click="$emit('back')">
          <span>🏠</span> 返回主页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['retry', 'back']);
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
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  min-width: 320px;
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}

.fail-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.modal-content h2 {
  color: #ff6b6b;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.message {
  color: #888;
  margin-bottom: 1.5rem;
}

.tip-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: left;
}

.tip-icon {
  font-size: 1.5rem;
}

.tip-box p {
  color: #fbbf24;
  font-size: 0.9rem;
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
  background: linear-gradient(135deg, #ff6b6b, #ef4444);
  color: white;
  font-weight: bold;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    padding: 2rem;
  }
}
</style>
