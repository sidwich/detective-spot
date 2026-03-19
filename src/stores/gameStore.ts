import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LevelData {
  id: number;
  name: string;
  imageA: string;
  imageB: string;
  differences: Array<{
    x: number;
    y: number;
    radius: number;
  }>;
  diffCount: number;
  timeLimit: number;
}

export const useGameStore = defineStore('game', () => {
  // 当前关卡
  const currentLevel = ref(1);
  const totalLevels = ref(20);
  
  // 游戏状态
  const isPlaying = ref(false);
  const isPaused = ref(false);
  
  // 玩家进度
  const completedLevels = ref<number[]>([]);
  const levelStars = ref<Record<number, number>>({});
  
  // 临时关卡数据（后续从JSON加载）
  const levelsData = ref<LevelData[]>([
    {
      id: 1,
      name: '侦探社办公室',
      imageA: '/assets/levels/01_office_a.jpg',
      imageB: '/assets/levels/01_office_b.jpg',
      differences: [
        { x: 200, y: 150, radius: 30 },
        { x: 400, y: 300, radius: 25 },
        { x: 600, y: 200, radius: 35 },
        { x: 800, y: 400, radius: 30 },
        { x: 1000, y: 250, radius: 25 },
      ],
      diffCount: 5,
      timeLimit: 60,
    },
    // TODO: 添加更多关卡数据
  ]);

  const getCurrentLevel = computed(() => {
    return levelsData.value.find(l => l.id === currentLevel.value);
  });

  const startGame = () => {
    currentLevel.value = 1;
    isPlaying.value = true;
    isPaused.value = false;
  };

  const nextLevel = () => {
    if (currentLevel.value < totalLevels.value) {
      currentLevel.value++;
    }
  };

  const completeLevel = (timeBonus: number) => {
    if (!completedLevels.value.includes(currentLevel.value)) {
      completedLevels.value.push(currentLevel.value);
    }
    // 根据剩余时间计算星级
    const stars = timeBonus > 30 ? 3 : timeBonus > 15 ? 2 : 1;
    levelStars.value[currentLevel.value] = stars;
  };

  const pauseGame = () => {
    isPaused.value = true;
  };

  const resumeGame = () => {
    isPaused.value = false;
  };

  return {
    currentLevel,
    totalLevels,
    isPlaying,
    isPaused,
    completedLevels,
    levelStars,
    levelsData,
    getCurrentLevel,
    startGame,
    nextLevel,
    completeLevel,
    pauseGame,
    resumeGame,
  };
});
