<template>
  <div class="settings">
    <!-- 顶部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <span>←</span> 返回
      </button>
      <h2>设置</h2>
      <div class="placeholder"></div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 音效设置 -->
      <div class="setting-group">
        <h3>🔊 音效设置</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-icon">🎵</span>
            <div class="setting-text">
              <div class="setting-label">背景音乐</div>
              <div class="setting-desc">游戏背景音乐的开关</div>
            </div>
          </div>
          <button 
            class="toggle-btn"
            :class="{ active: gameStore.musicEnabled }"
            @click="toggleMusic"
          >
            <span class="toggle-slider"></span>
          </button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-icon">🔊</span>
            <div class="setting-text">
              <div class="setting-label">游戏音效</div>
              <div class="setting-desc">点击、提示等音效</div>
            </div>
          </div>
          <button 
            class="toggle-btn"
            :class="{ active: gameStore.soundEnabled }"
            @click="toggleSound"
          >
            <span class="toggle-slider"></span>
          </button>
        </div>
      </div>

      <!-- 游戏数据 -->
      <div class="setting-group">
        <h3>💾 游戏数据</h3>
        
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-value">{{ gameStore.completedLevels.length }}</div>
            <div class="stat-label">已通关</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ gameStore.totalStars }}</div>
            <div class="stat-label">总星星</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ gameStore.totalHints }}</div>
            <div class="stat-label">提示次数</div>
          </div>
        </div>

        <button class="danger-btn" @click="showResetConfirm = true">
          <span>🗑️</span> 重置游戏进度
        </button>
      </div>

      <!-- 关于 -->
      <div class="setting-group">
        <h3>ℹ️ 关于游戏</h3>
        
        <div class="about-info">
          <div class="about-item">
            <span class="about-label">游戏名称</span>
            <span class="about-value">找茬侦探社</span>
          </div>
          <div class="about-item">
            <span class="about-label">版本</span>
            <span class="about-value">v1.0.0</span>
          </div>
          <div class="about-item">
            <span class="about-label">开发者</span>
            <span class="about-value">Kimi Claw</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 重置确认弹窗 -->
    <div v-if="showResetConfirm" class="modal-overlay" @click.self="showResetConfirm = false">
      <div class="modal">
        <div class="modal-icon">⚠️</div>
        <h3>确认重置？</h3>
        <p>此操作将清除所有游戏进度，无法恢复！</p>
        
        <div class="modal-actions">
          <button class="btn-secondary" @click="showResetConfirm = false">取消</button>
          <button class="btn-danger" @click="resetProgress">确认重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { soundManager } from '../game/SoundManager';

const gameStore = useGameStore();
const showResetConfirm = ref(false);

const toggleMusic = () => {
  soundManager.playClick();
  gameStore.toggleMusic();
  soundManager.setMusicEnabled(gameStore.musicEnabled);
};

const toggleSound = () => {
  gameStore.toggleSound();
  soundManager.setEnabled(gameStore.soundEnabled);
  if (gameStore.soundEnabled) {
    soundManager.playClick();
  }
};

const resetProgress = () => {
  soundManager.playClick();
  gameStore.resetProgress();
  showResetConfirm.value = false;
};

const goBack = () => {
  soundManager.playClick();
  gameStore.goToMenu();
};
</script>

<style scoped>
.settings {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
}

/* 头部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 20px;
  color: #d4a574;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(212, 165, 116, 0.1);
  border-color: #d4a574;
}

.header h2 {
  color: #d4a574;
  font-size: 1.5rem;
}

.placeholder {
  width: 80px;
}

/* 设置内容 */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-group h3 {
  color: #d4a574;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-icon {
  font-size: 1.5rem;
}

.setting-label {
  color: #fff;
  font-weight: bold;
}

.setting-desc {
  color: #888;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* 切换按钮 */
.toggle-btn {
  width: 50px;
  height: 28px;
  background: #444;
  border: none;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-btn.active {
  background: #4ade80;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-btn.active .toggle-slider {
  transform: translateX(22px);
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(212, 165, 116, 0.1);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  color: #d4a574;
  font-weight: bold;
}

.stat-label {
  color: #888;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* 危险按钮 */
.danger-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #ef4444;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 关于信息 */
.about-info {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
}

.about-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.about-item:last-child {
  border-bottom: none;
}

.about-label {
  color: #888;
}

.about-value {
  color: #d4a574;
  font-weight: bold;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  max-width: 350px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal h3 {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.modal p {
  color: #888;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn-danger:hover {
  background: #f87171;
}

/* 响应式 */
@media (max-width: 768px) {
  .settings-content {
    padding: 1rem;
  }
  
  .stats-cards {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
