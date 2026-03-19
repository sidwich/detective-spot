<template>
  <div v-if="showDialog" class="anti-addiction-dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="icon">🛡️</div>
        <h2>{{ isAdult ? '实名认证' : '健康游戏提醒' }}</h2>
      </div>

      <!-- 未成年人提示 -->
      <div v-if="!isAdult && age !== null" class="warning-content">
        <div class="warning-icon">⏰</div>
        <p class="warning-text">
          根据相关法规，未成年人每日游戏时长受限。
          您今日还可游戏 <strong>{{ remainingTime }}分钟</strong>
        </p>
        <div class="time-info">
          <div class="time-item">
            <span class="label">今日已玩</span>
            <span class="value">{{ playedTime }}分钟</span>
          </div>
          <div class="time-item">
            <span class="label">剩余时间</span>
            <span class="value highlight">{{ remainingTime }}分钟</span>
          </div>
        </div>
        <p class="notice">
          温馨提示：适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。
        </p>
        
        <div class="actions">
          <button class="btn-primary" @click="confirm">我知道了</button>
        </div>
      </div>

      <!-- 实名认证入口 -->
      <div v-else class="auth-content">
        <p class="auth-desc">
          根据国家新闻出版署《关于防止未成年人沉迷网络游戏的通知》，
          游戏用户需进行实名认证。
        </p>
        
        <div class="auth-buttons">
          <button class="btn-primary" @click="startAuth">
            <span>👤</span> 微信一键实名
          </button>
          
          <button class="btn-secondary" @click="playAsGuest">
            <span>👤</span> 游客试玩（限时15分钟）
          </button>
        </div>
        
        <div class="auth-notice">
          <p>未实名认证用户将受到以下限制：</p>
          <ul>
            <li>⚠️ 每日累计游戏时长不超过1小时</li>
            <li>⚠️ 每日22:00-次日8:00无法游戏</li>
            <li>⚠️ 无法参与排行榜、充值等功能</li>
          </ul>
        </div>
      </div>

      <!-- 强制下线提示 -->
      <div v-if="showForceExit" class="force-exit">
        <div class="exit-icon">🚫</div>
        <h3>游戏时间已用完</h3>
        <p>您今日的游戏时间已达到上限，请明日再玩。</p>
        
        <button class="btn-primary" @click="exitGame">退出游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { isWechat, setStorage, getStorage, showToast, exitMiniProgram } from './wechat';

const showDialog = ref(false);
const isAdult = ref(false);
const age = ref<number | null>(null);
const playedTime = ref(0);
const showForceExit = ref(false);

// 每日限制时间（分钟）
const DAILY_LIMIT = 60;
const GUEST_LIMIT = 15;

const remainingTime = computed(() => {
  const limit = isAdult.value ? DAILY_LIMIT : GUEST_LIMIT;
  return Math.max(0, limit - playedTime.value);
});

// 检查是否需要进行实名认证
function checkAuth() {
  const authInfo = getStorage('anti_addiction_auth', null);
  const today = new Date().toDateString();
  const todayPlayTime = getStorage(`play_time_${today}`, 0);
  
  playedTime.value = todayPlayTime;
  
  if (!authInfo) {
    // 未认证，显示认证弹窗
    showDialog.value = true;
    isAdult.value = false;
    age.value = null;
    return;
  }
  
  // 已认证，检查年龄和时间限制
  age.value = authInfo.age;
  isAdult.value = authInfo.age >= 18;
  
  if (!isAdult.value) {
    // 未成年人
    const limit = DAILY_LIMIT;
    if (todayPlayTime >= limit) {
      // 时间用完，强制退出
      showForceExit.value = true;
      showDialog.value = true;
    } else if (todayPlayTime >= limit * 0.8) {
      // 剩余时间不足20%，提醒
      showDialog.value = true;
    }
  }
  
  // 检查宵禁时间（22:00-8:00）
  if (!isAdult.value) {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 8) {
      showToast('每日22:00-次日8:00无法游戏', 'none');
      exitGame();
      return;
    }
  }
}

// 开始实名认证
function startAuth() {
  if (!isWechat) {
    // 非微信环境，模拟认证
    mockAuth();
    return;
  }
  
  // 调用微信实名认证
  // @ts-ignore
  wx.startRealNameAuth({
    success: (res: any) => {
      console.log('实名认证成功:', res);
      // 解析年龄
      const authInfo = {
        age: 25, // 实际应从res中解析
        authTime: Date.now(),
      };
      setStorage('anti_addiction_auth', authInfo);
      isAdult.value = true;
      age.value = 25;
      showDialog.value = false;
      showToast('认证成功', 'success');
    },
    fail: (err: any) => {
      console.error('实名认证失败:', err);
      showToast('认证失败，请重试', 'none');
    },
  });
}

// 模拟认证（Web环境）
function mockAuth() {
  const authInfo = {
    age: 25,
    authTime: Date.now(),
  };
  setStorage('anti_addiction_auth', authInfo);
  isAdult.value = true;
  age.value = 25;
  showDialog.value = false;
}

// 游客试玩
function playAsGuest() {
  const authInfo = {
    age: 16, // 标记为未成年人
    isGuest: true,
    authTime: Date.now(),
  };
  setStorage('anti_addiction_auth', authInfo);
  isAdult.value = false;
  age.value = 16;
  showDialog.value = false;
  showToast('游客模式：限时15分钟', 'none');
}

// 确认提示
function confirm() {
  showDialog.value = false;
}

// 退出游戏
function exitGame() {
  exitMiniProgram();
}

// 记录游戏时长
let playTimer: number | null = null;

export function startPlayTimeTracking() {
  if (playTimer) return;
  
  playTimer = window.setInterval(() => {
    const today = new Date().toDateString();
    const key = `play_time_${today}`;
    const current = getStorage(key, 0);
    setStorage(key, current + 1);
    
    // 检查是否需要提醒
    const authInfo = getStorage('anti_addiction_auth', null);
    if (authInfo && authInfo.age < 18) {
      const limit = authInfo.isGuest ? GUEST_LIMIT : DAILY_LIMIT;
      const remaining = limit - current - 1;
      
      if (remaining === 10) {
        showToast('剩余游戏时间不足10分钟', 'none');
      } else if (remaining === 5) {
        showToast('剩余游戏时间不足5分钟', 'none');
      } else if (remaining <= 0) {
        showForceExit.value = true;
        showDialog.value = true;
      }
    }
  }, 60000); // 每分钟记录一次
}

export function stopPlayTimeTracking() {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
}

onMounted(() => {
  checkAuth();
});

defineExpose({
  checkAuth,
  startPlayTimeTracking,
  stopPlayTimeTracking,
});
</script>

<style scoped>
.anti-addiction-dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.dialog-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid rgba(212, 165, 116, 0.3);
  border-radius: 24px;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
}

.dialog-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.dialog-header .icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.dialog-header h2 {
  color: #d4a574;
  font-size: 1.5rem;
}

/* 警告内容 */
.warning-content {
  text-align: center;
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.warning-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.warning-text strong {
  color: #fbbf24;
  font-size: 1.3rem;
}

.time-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.time-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
}

.time-item .label {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.time-item .value {
  font-size: 1.2rem;
  color: #d4a574;
  font-weight: bold;
}

.time-item .value.highlight {
  color: #fbbf24;
}

.notice {
  color: #888;
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 认证内容 */
.auth-content {
  text-align: center;
}

.auth-desc {
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.auth-buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #d4a574, #b8956a);
  color: #1a1a2e;
  font-weight: bold;
}

.btn-primary:hover {
  transform: scale(1.02);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.auth-notice {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
}

.auth-notice p {
  color: #fbbf24;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.auth-notice ul {
  list-style: none;
  color: #ccc;
  font-size: 0.85rem;
}

.auth-notice li {
  margin: 0.5rem 0;
}

/* 强制退出 */
.force-exit {
  text-align: center;
}

.exit-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.force-exit h3 {
  color: #ef4444;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.force-exit p {
  color: #888;
  margin-bottom: 1.5rem;
}

/* 响应式 */
@media (max-width: 480px) {
  .dialog-content {
    padding: 1.5rem;
  }
  
  .dialog-header h2 {
    font-size: 1.3rem;
  }
  
  .time-info {
    grid-template-columns: 1fr;
  }
}
</style>
