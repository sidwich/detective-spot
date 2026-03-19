<template>
  <div id="game-app">
    <!-- 防沉迷弹窗 -->
    <AntiAddiction ref="antiAddictionRef" />
    
    <!-- 主菜单 -->
    <MainMenu v-if="gameStore.currentView === 'menu'" />
    
    <!-- 关卡选择 -->
    <LevelSelect v-else-if="gameStore.currentView === 'level-select'" />
    
    <!-- 设置 -->
    <Settings v-else-if="gameStore.currentView === 'settings'" />
    
    <!-- 游戏场景 -->
    <GameScene v-else-if="gameStore.currentView === 'game'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useGameStore } from './stores/gameStore';
import { isWechat, showShareMenu, checkForUpdate, onMemoryWarning } from './platform/wechat';
import { handleShareEntry, parseShareQuery } from './platform/share';
import {
  startPlayTimeTracking,
  stopPlayTimeTracking,
} from './composables/useAntiAddiction';

import MainMenu from './components/MainMenu.vue';
import LevelSelect from './components/LevelSelect.vue';
import Settings from './components/Settings.vue';
import GameScene from './components/GameScene.vue';
import AntiAddiction from './components/AntiAddiction.vue';

const gameStore = useGameStore();
const antiAddictionRef = ref();

onMounted(() => {
  // 检查是否在小程序环境
  if (isWechat) {
    // 显示分享按钮
    showShareMenu();
    
    // 检查更新
    checkForUpdate();
    
    // 监听内存警告
    onMemoryWarning((res) => {
      console.warn('内存警告:', res.level);
      // 可以在这里清理缓存
    });
    
    // 处理分享进入
    // @ts-ignore
    const launchOptions = wx.getLaunchOptionsSync();
    if (launchOptions.query) {
      const query = parseShareQuery(
        Object.entries(launchOptions.query)
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      );
      const entry = handleShareEntry(query as Record<string, string>);
      
      if (entry.type === 'help' && entry.level) {
        // 帮助模式，直接进入对应关卡
        gameStore.startLevel(entry.level);
      }
    }
    
    // 开始记录游戏时长（防沉迷）
    startPlayTimeTracking();
  }
});

onUnmounted(() => {
  stopPlayTimeTracking();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0d0d1a;
  overflow: hidden;
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

#game-app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
