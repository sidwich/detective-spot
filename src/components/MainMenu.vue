<template>
  <div class="main-menu">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="grid-pattern"></div>
      <div class="floating-shapes">
        <div class="shape shape-1">🔍</div>
        <div class="shape shape-2">🔎</div>
        <div class="shape shape-3">🕵️</div>
        <div class="shape shape-4">🔎</div>
      </div>
    </div>
    
    <!-- 主内容 -->
    <div class="menu-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo-icon">🕵️‍♂️</div>
        <h1 class="game-title">
          <span class="title-main">找茬侦探社</span>
          <span class="title-sub">Spot the Difference</span>
        </h1>
        <p class="game-slogan">锻炼你的观察力，破解每一个谜题！</p>
      </div>
      
      <!-- 进度概览 -->
      <div v-if="hasProgress" class="progress-section">
        <div class="progress-info">
          <div class="progress-text">
            已完成 {{ completedCount }}/{{ totalLevels }} 关
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalStars }}</span>
            <span class="stat-label">⭐ 总星数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalScore }}</span>
            <span class="stat-label">🏆 总分</span>
          </div>
        </div>
      </div>
      
      <!-- 按钮组 -->
      <div class="button-group">
        <button 
          v-if="hasProgress" 
          class="menu-btn btn-continue"
          @click="continueGame"
        >
          <span class="btn-icon">▶️</span>
          <span class="btn-text">继续游戏</span>
          <span class="btn-hint">第 {{ nextLevel }} 关</span>
        </button>
        
        <button class="menu-btn btn-new" @click="startNewGame">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">{{ hasProgress ? '重新开始' : '开始游戏' }}</span>
        </button>
        
        <button class="menu-btn btn-levels" @click="goToLevelSelect">
          <span class="btn-icon">🗺️</span>
          <span class="btn-text">关卡选择</span>
        </button>
        
        <button class="menu-btn btn-settings" @click="showSettings = true">
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">设置</span>
        </button>
        
        <button class="menu-btn btn-share" @click="handleShare">
          <span class="btn-icon">📤</span>
          <span class="btn-text">邀请好友</span>
        </button>
      </div>
      
      <!-- 版本信息 -->
      <div class="version-info">
        v1.0.0 | 20个精彩关卡等你挑战
      </div>
    </div>
    
    <!-- 设置弹窗 -->
    <div v-if="showSettings" class="modal-overlay" @click.self="showSettings = false">
      <div class="settings-modal">
        <h2>⚙️ 游戏设置</h2>
        
        <div class="setting-item">
          <label>音效</label>
          <button class="toggle-btn" :class="{ active: settings.soundEnabled }" @click="toggleSound">
            {{ settings.soundEnabled ? '🔊 开启' : '🔇 关闭' }}
          </button>
        </div>
        
        <div class="setting-item">
          <label>背景音乐</label>
          <button class="toggle-btn" :class="{ active: settings.musicEnabled }" @click="toggleMusic">
            {{ settings.musicEnabled ? '🎵 开启' : '🎵 关闭' }}
          </button>
        </div>
        
        <div class="setting-item">
          <label>震动反馈</label>
          <button class="toggle-btn" :class="{ active: settings.vibrationEnabled }" @click="toggleVibration">
            {{ settings.vibrationEnabled ? '📳 开启' : '📳 关闭' }}
          </button>
        </div>
        
        <div class="setting-item danger">
          <button class="reset-btn" @click="confirmReset">🗑️ 重置所有进度</button>
        </div>
        
        <button class="close-btn" @click="showSettings = false">关闭</button>
      </div>
    </div>
    
    <!-- 重置确认弹窗 -->
    <div v-if="showResetConfirm" class="modal-overlay" @click.self="showResetConfirm = false">
      <div class="confirm-modal">
        <div class="confirm-icon">⚠️</div>
        
        <h3>确定要重置所有进度吗？</h3>
        
        <p>此操作不可恢复，所有关卡进度将被清空。</p>
        
        <div class="confirm-buttons">
          <button class="btn-cancel" @click="showResetConfirm = false">取消</button>
          
          <button class="btn-confirm" @click="resetProgress">确定重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { soundManager } from '../game/SoundManager';
import { shareToFriend, inviteFriends, generateShareImage } from '../platform/share';

const gameStore = useGameStore();
const showSettings = ref(false);
const showResetConfirm = ref(false);

// 计算属性
const hasProgress = computed(() => gameStore.getCompletedCount > 0);
const completedCount = computed(() => gameStore.getCompletedCount);
const totalLevels = computed(() => gameStore.totalLevels);
const progressPercent = computed(() => gameStore.getTotalProgress);
const nextLevel = computed(() => gameStore.getNextLevel || 1);
const totalStars = computed(() => Object.values(gameStore.progress.levelStars).reduce((a, b) => a + b, 0));
const totalScore = computed(() => gameStore.progress.totalScore);
const settings = computed(() => gameStore.settings);

// 方法
const startNewGame = () => {
  soundManager.playClick();
  gameStore.startNewGame();
};

const continueGame = () => {
  soundManager.playClick();
  gameStore.continueGame();
};

const goToLevelSelect = () => {
  soundManager.playClick();
  gameStore.setScene('levelSelect');
};

const toggleSound = () => {
  soundManager.playClick();
  gameStore.updateSettings({ soundEnabled: !settings.value.soundEnabled });
};

const toggleMusic = () => {
  soundManager.playClick();
  gameStore.updateSettings({ musicEnabled: !settings.value.musicEnabled });
  if (settings.value.musicEnabled) {
    // BGM not implemented;
  } else {
    // BGM not implemented;
  }
};

const toggleVibration = () => {
  soundManager.playClick();
  gameStore.updateSettings({ vibrationEnabled: !settings.value.vibrationEnabled });
};

const confirmReset = () => {
  showSettings.value = false;
  showResetConfirm.value = true;
};

const resetProgress = () => {
  soundManager.playClick();
  gameStore.resetProgress();
  showResetConfirm.value = false;
};

const handleShare = async () => {
  soundManager.playClick();
  
  // 生成分享图
  const shareImage = await generateShareImage({
    level: nextLevel.value,
    stars: totalStars.value,
    score: totalScore.value,
  });
  
  // 调用分享
  inviteFriends();
};
</script>

<style scoped>
.main-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(212, 165, 116, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 165, 116, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.floating-shapes {
  position: absolute;
  inset: 0;
}

.shape {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  animation: float 6s ease-in-out infinite;
}

.shape-1 { top: 10%; left: 10%; animation-delay: 0s; }
.shape-2 { top: 20%; right: 15%; animation-delay: 1s; }
.shape-3 { bottom: 20%; left: 15%; animation-delay: 2s; }
.shape-4 { bottom: 15%; right: 10%; animation-delay: 3s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 主内容 */
.menu-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

/* Logo */
.logo-section {
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: detectiveFloat 3s ease-in-out infinite;
}

@keyframes detectiveFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.game-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.title-main {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4a574;
  text-shadow: 0 0 20px rgba(212, 165, 116, 0.3);
  letter-spacing: 4px;
}

.title-sub {
  font-size: 1rem;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.game-slogan {
  color: #888;
  font-size: 0.95rem;
}

/* 进度区域 */
.progress-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(212, 165, 116, 0.1);
}

.progress-info {
  margin-bottom: 1rem;
}

.progress-text {
  color: #d4a574;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a574, #e8c9a0);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

/* 按钮组 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.menu-btn:hover {
  transform: translateY(-2px);
}

.menu-btn:active {
  transform: translateY(0);
}

.btn-continue {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0d0d1a;
  font-weight: bold;
}

.btn-new {
  background: linear-gradient(135deg, #d4a574, #c49a6c);
  color: #0d0d1a;
  font-weight: bold;
}

.btn-levels {
  background: rgba(212, 165, 116, 0.1);
  color: #d4a574;
  border: 2px solid rgba(212, 165, 116, 0.3);
}

.btn-settings {
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-hint {
  position: absolute;
  right: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 版本信息 */
.version-info {
  margin-top: 2rem;
  color: #444;
  font-size: 0.8rem;
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
  padding: 1rem;
}

.settings-modal,
.confirm-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(212, 165, 116, 0.2);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 350px;
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

.settings-modal h2,
.confirm-modal h3 {
  color: #d4a574;
  margin-bottom: 1.5rem;
  text-align: center;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item label {
  color: #aaa;
}

.setting-item.danger {
  border-bottom: none;
  justify-content: center;
  padding-top: 1.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #4ade80;
  color: #0d0d1a;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ff4444;
  border-radius: 8px;
  background: transparent;
  color: #ff4444;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 68, 68, 0.1);
}

.close-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(212, 165, 116, 0.2);
  color: #d4a574;
  cursor: pointer;
}

.confirm-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.confirm-modal p {
  color: #888;
  text-align: center;
  margin-bottom: 1.5rem;
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

/* 响应式 */
@media (max-width: 480px) {
  .title-main {
    font-size: 2rem;
  }
  
  .menu-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
