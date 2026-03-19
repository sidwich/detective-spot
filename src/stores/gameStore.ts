import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { levelsData, type LevelData } from '../data/levels';

// 本地存储键名
const STORAGE_KEY = 'detective-spot-save-v1';

interface SaveData {
  completedLevels: number[];
  levelStars: Record<number, number>;
  unlockedLevels: number[];
  totalHints: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export const useGameStore = defineStore('game', () => {
  // 当前视图状态
  const currentView = ref<'menu' | 'level-select' | 'game' | 'settings'>('menu');
  
  // 当前关卡
  const currentLevel = ref(1);
  const totalLevels = ref(levelsData.length);
  
  // 游戏状态
  const isPlaying = ref(false);
  const isPaused = ref(false);
  
  // 玩家进度
  const completedLevels = ref<number[]>([]);
  const levelStars = ref<Record<number, number>>({});
  const unlockedLevels = ref<number[]>([1]);
  
  // 游戏设置
  const totalHints = ref(10);
  const soundEnabled = ref(true);
  const musicEnabled = ref(true);
  const vibrationEnabled = ref(true);

  // 计算属性
  const getCurrentLevel = computed(() => {
    return levelsData.find(l => l.id === currentLevel.value);
  });

  const isLevelUnlocked = computed(() => (levelId: number) => {
    return unlockedLevels.value.includes(levelId);
  });

  const getLevelStars = computed(() => (levelId: number) => {
    return levelStars.value[levelId] || 0;
  });

  const totalStars = computed(() => {
    return Object.values(levelStars.value).reduce((sum, stars) => sum + stars, 0);
  });

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SaveData = JSON.parse(saved);
        completedLevels.value = data.completedLevels || [];
        levelStars.value = data.levelStars || {};
        unlockedLevels.value = data.unlockedLevels || [1];
        totalHints.value = data.totalHints ?? 10;
        soundEnabled.value = data.soundEnabled ?? true;
        musicEnabled.value = data.musicEnabled ?? true;
        vibrationEnabled.value = data.vibrationEnabled ?? true;
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
    }
  };

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      const data: SaveData = {
        completedLevels: completedLevels.value,
        levelStars: levelStars.value,
        unlockedLevels: unlockedLevels.value,
        totalHints: totalHints.value,
        soundEnabled: soundEnabled.value,
        musicEnabled: musicEnabled.value,
        vibrationEnabled: vibrationEnabled.value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  };

  // 导航方法
  const goToMenu = () => {
    currentView.value = 'menu';
    isPlaying.value = false;
  };

  const goToLevelSelect = () => {
    currentView.value = 'level-select';
  };

  const goToSettings = () => {
    currentView.value = 'settings';
  };

  // 开始新游戏（从第一关）
  const startNewGame = () => {
    currentLevel.value = 1;
    currentView.value = 'game';
    isPlaying.value = true;
    isPaused.value = false;
  };

  // 继续游戏（从下一关）
  const continueGame = () => {
    const nextLevelId = completedLevels.value.length > 0 
      ? Math.max(...completedLevels.value) + 1 
      : 1;
    currentLevel.value = Math.min(nextLevelId, totalLevels.value);
    currentView.value = 'game';
    isPlaying.value = true;
    isPaused.value = false;
  };

  // 通用场景切换
  const setScene = (scene: 'menu' | 'level-select' | 'game' | 'settings') => {
    currentView.value = scene;
    if (scene !== 'game') {
      isPlaying.value = false;
    }
  };

  // 更新设置
  const updateSettings = (settings: Partial<{ soundEnabled: boolean; musicEnabled: boolean; vibrationEnabled: boolean }>) => {
    if (settings.soundEnabled !== undefined) {
      soundEnabled.value = settings.soundEnabled;
    }
    if (settings.musicEnabled !== undefined) {
      musicEnabled.value = settings.musicEnabled;
    }
    if (settings.vibrationEnabled !== undefined) {
      vibrationEnabled.value = settings.vibrationEnabled;
    }
    saveToStorage();
  };

  // 游戏方法
  const startLevel = (levelId: number) => {
    if (!unlockedLevels.value.includes(levelId)) return;
    currentLevel.value = levelId;
    currentView.value = 'game';
    isPlaying.value = true;
    isPaused.value = false;
  };

  const completeLevel = (timeBonus: number) => {
    if (!completedLevels.value.includes(currentLevel.value)) {
      completedLevels.value.push(currentLevel.value);
    }
    
    // 计算星级
    const levelData = getCurrentLevel.value;
    const timeLimit = levelData?.timeLimit || 60;
    const timeRatio = timeBonus / timeLimit;
    const stars = timeRatio > 0.5 ? 3 : timeRatio > 0.25 ? 2 : 1;
    
    // 只保存最高星级
    const currentStars = levelStars.value[currentLevel.value] || 0;
    levelStars.value[currentLevel.value] = Math.max(currentStars, stars);

    // 解锁下一关
    const nextLevelId = currentLevel.value + 1;
    if (nextLevelId <= totalLevels.value && !unlockedLevels.value.includes(nextLevelId)) {
      unlockedLevels.value.push(nextLevelId);
    }

    // 奖励提示次数
    totalHints.value += stars;

    saveToStorage();
    return stars;
  };

  const nextLevel = () => {
    if (currentLevel.value < totalLevels.value) {
      currentLevel.value++;
      if (!unlockedLevels.value.includes(currentLevel.value)) {
        unlockedLevels.value.push(currentLevel.value);
        saveToStorage();
      }
    }
  };

  const useHint = () => {
    if (totalHints.value > 0) {
      totalHints.value--;
      saveToStorage();
      return true;
    }
    return false;
  };

  const addHints = (count: number) => {
    totalHints.value += count;
    saveToStorage();
  };

  const pauseGame = () => {
    isPaused.value = true;
  };

  const resumeGame = () => {
    isPaused.value = false;
  };

  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value;
    saveToStorage();
  };

  const toggleMusic = () => {
    musicEnabled.value = !musicEnabled.value;
    saveToStorage();
  };

  // 重置进度
  const resetProgress = () => {
    completedLevels.value = [];
    levelStars.value = {};
    unlockedLevels.value = [1];
    totalHints.value = 10;
    saveToStorage();
  };

  // 初始化时加载存档
  loadFromStorage();

  return {
    // 状态
    currentView,
    currentLevel,
    totalLevels,
    isPlaying,
    isPaused,
    completedLevels,
    levelStars,
    unlockedLevels,
    totalHints,
    soundEnabled,
    musicEnabled,
    vibrationEnabled,
    levelsData,
    
    // 计算属性
    getCurrentLevel,
    isLevelUnlocked,
    getLevelStars,
    totalStars,
    
    // 方法
    goToMenu,
    goToLevelSelect,
    goToSettings,
    startNewGame,
    continueGame,
    setScene,
    updateSettings,
    startLevel,
    completeLevel,
    nextLevel,
    useHint,
    addHints,
    pauseGame,
    resumeGame,
    toggleSound,
    toggleMusic,
    resetProgress,
    saveToStorage,
  };
});
