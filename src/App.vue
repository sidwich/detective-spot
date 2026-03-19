<template>
  <div id="game-container">
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
import { useGameStore } from './stores/gameStore';
import MainMenu from './components/MainMenu.vue';
import LevelSelect from './components/LevelSelect.vue';
import Settings from './components/Settings.vue';
import GameScene from './components/GameScene.vue';

const gameStore = useGameStore();
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
}

#game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
