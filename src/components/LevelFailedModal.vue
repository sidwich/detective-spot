<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="icon">😅</div>
      
      <h2>时间到！</h2>
      <p class="message">别气馁，再仔细观察一下~🔍</p>
      
      <div class="buttons">
        <button class="btn-primary" @click="$emit('retry')">
          再试一次 💪
        </button>
        <button class="btn-secondary" @click="$emit('back')"
          返回主页 🏠
        </button>
      </div>
      
      <div class="share-hint">
        💡 分享给好友，可获得一次提示机会！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['retry', 'back']);
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
  border: 2px solid #666;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  min-width: 300px;
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  color: #ff6b6b;
  margin-bottom: 0.5rem;
}

.message {
  color: #888;
  margin-bottom: 1.5rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
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
  background: #ff6b6b;
  color: white;
  font-weight: bold;
}

.btn-primary:hover {
  background: #ff8585;
  transform: scale(1.05);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #666;
  color: #888;
}

.btn-secondary:hover {
  border-color: #888;
  color: #aaa;
}

.share-hint {
  font-size: 0.85rem;
  color: #d4a574;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(212, 165, 116, 0.1);
  border-radius: 10px;
}
</style>
