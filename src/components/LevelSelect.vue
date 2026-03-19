<template>
  <div class="level-select">
    <!-- 头部 -->
    <header class="header">
      <button class="back-btn" @click="goBack">
        <span>←</span> 返回
      </button>
      
      <h1 class="title">🗺️ 关卡选择</h1>
      
      <div class="header-stats">
        <span class="stat">⭐ {{ totalStars }}/{{ maxStars }}</span>
      </div>
    </header>
    
    <!-- 难度筛选 -->
    <div class="filter-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="filter-tab"
        :class="{ active: currentFilter === tab.value }"
        @click="currentFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 关卡网格 -->
    <div class="levels-grid">
      <div 
        v-for="level in filteredLevels" 
        :key="level.id"
        class="level-card"
        :class="{ 
          locked: !isUnlocked(level.id),
          completed: isCompleted(level.id),
          current: isCurrent(level.id)
        }"
        @click="selectLevel(level.id)"
      >
        <!-- 锁定遮罩 -->
        <div v-if="!isUnlocked(level.id)" class="lock-overlay">
          <span class="lock-icon">🔒</span>
        </div>
        
        <!-- 关卡信息 -->
        <div class="level-header">
          <span class="level-number">{{ level.id }}</span>
          <span class="difficulty-badge" :class="level.difficulty">
            {{ getDifficultyLabel(level.difficulty) }}
          </span>
        </div>
        
        <div class="level-preview">
          <div class="preview-placeholder" :style="{ background: getLevelColor(level.id) }">
            <span class="preview-icon">{{ getLevelIcon(level.id) }}</span>
          </div>
        </div>
        
        <div class="level-info">
          <h3 class="level-name">{{ level.name }}</h3>
          <p class="level-desc">{{ level.description }}</p>
        </div>
        
        <!-- 星级显示 -->
        <div class="level-stars">
          <span 
            v-for="n in 3" 
            :key="n"
            class="star"
            :class="{ active: getLevelStars(level.id) >= n }"
          >
            ⭐
          </span>
        </div>
        
        <!-- 分数显示 -->
        <div v-if="getLevelScore(level.id) > 0" class="level-score">
          🏆 {{ getLevelScore(level.id) }}
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredLevels.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>没有找到符合条件的关卡</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { soundManager } from '../game/SoundManager';

const gameStore = useGameStore();
const currentFilter = ref('all');

const tabs = [
  { label: '全部', value: 'all' },
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
];

// 计算属性
const filteredLevels = computed(() => {
  if (currentFilter.value === 'all') {
    return gameStore.levels;
  }
  return gameStore.levels.filter(l => l.difficulty === currentFilter.value);
});

const totalStars = computed(() => {
  return Object.values(gameStore.progress.levelStars).reduce((a, b) => a + b, 0);
});

const maxStars = computed(() => gameStore.totalLevels * 3);

// 方法
const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty] || difficulty;
};

const getLevelColor = (id: number) => {
  const colors = [
    'linear-gradient(135deg, #1a1a2e, #533483)',
    'linear-gradient(135deg, #16213e, #0f3460)',
    'linear-gradient(135deg, #0f3460, #533483)',
    'linear-gradient(135deg, #533483, #e94560)',
    'linear-gradient(135deg, #1a1a2e, #e94560)',
  ];
  return colors[id % colors.length];
};

const getLevelIcon = (id: number) => {
  const icons = ['🔍', '🔎', '🕵️', '📸', '🔦', '🧩', '🎯', '💎', '🏆', '🎖️'];
  return icons[id % icons.length];
};

const isUnlocked = (levelId: number) => {
  return gameStore.isLevelUnlocked(levelId);
};

const isCompleted = (levelId: number) => {
  return gameStore.isLevelCompleted(levelId);
};

const isCurrent = (levelId: number) => {
  return levelId === gameStore.currentLevel;
};

const getLevelStars = (levelId: number) => {
  return gameStore.getLevelStars(levelId);
};

const getLevelScore = (levelId: number) => {
  return gameStore.progress.levelScores[levelId] || 0;
};

const selectLevel = (levelId: number) => {
  if (!isUnlocked(levelId)) {
    soundManager.playWrong();
    gameStore.vibrate([50, 50, 50]);
    return;
  }
  
  soundManager.playClick();
  gameStore.startGame(levelId);
};

const goBack = () => {
  soundManager.playClick();
  gameStore.setScene('menu');
};
</script>

<style scoped>
.level-select {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(212, 165, 116, 0.1);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #d4a574;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: rgba(212, 165, 116, 0.1);
}

.title {
  font-size: 1.25rem;
  color: #d4a574;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: bold;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-tab {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 0.9rem;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-tab.active {
  background: #d4a574;
  color: #0d0d1a;
  border-color: #d4a574;
  font-weight: bold;
}

/* 关卡网格 */
.levels-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
  overflow-y: auto;
  align-content: start;
}

/* 关卡卡片 */
.level-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(212, 165, 116, 0.1);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.level-card:hover:not(.locked) {
  transform: translateY(-4px);
  border-color: rgba(212, 165, 116, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.level-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.level-card.completed {
  border-color: rgba(74, 222, 128, 0.3);
}

.level-card.current {
  border-color: #d4a574;
  box-shadow: 0 0 20px rgba(212, 165, 116, 0.2);
}

/* 锁定遮罩 */
.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.lock-icon {
  font-size: 2rem;
  opacity: 0.7;
}

/* 关卡头部 */
.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.level-number {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(212, 165, 116, 0.2);
  border-radius: 50%;
  color: #d4a574;
  font-size: 0.85rem;
  font-weight: bold;
}

.difficulty-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.difficulty-badge.easy {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.difficulty-badge.medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.difficulty-badge.hard {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

/* 预览图 */
.level-preview {
  margin-bottom: 0.75rem;
}

.preview-placeholder {
  aspect-ratio: 16/10;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-icon {
  font-size: 2rem;
  opacity: 0.8;
}

/* 关卡信息 */
.level-name {
  font-size: 0.9rem;
  color: #d4a574;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.level-desc {
  font-size: 0.7rem;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 星级 */
.level-stars {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.75rem;
}

.star {
  font-size: 0.75rem;
  opacity: 0.2;
  transition: all 0.3s;
}

.star.active {
  opacity: 1;
}

/* 分数 */
.level-score {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.4rem;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 4px;
  font-size: 0.7rem;
  color: #ffd700;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* 响应式 */
@media (max-width: 480px) {
  .levels-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0 1rem 1rem;
  }
  
  .title {
    font-size: 1rem;
  }
  
  .back-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
