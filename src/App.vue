<template>
  <div id="game-container">
    <GameScene />
  </div>
</template>

<script setup lang="ts">
import GameScene from './components/GameScene.vue';
</script>

<style scoped>
#game-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
