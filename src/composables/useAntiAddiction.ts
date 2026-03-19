import { ref, computed } from 'vue';
import { isWechat, setStorage, getStorage, showToast, exitMiniProgram } from '../platform/wechat';

// 每日限制时间（分钟）
const DAILY_LIMIT = 60;
const GUEST_LIMIT = 15;

// 状态
const isAdult = ref(false);
const age = ref<number | null>(null);
const playedTime = ref(0);
const showForceExit = ref(false);
let playTimer: number | null = null;

const remainingTime = computed(() => {
  const limit = isAdult.value ? DAILY_LIMIT : GUEST_LIMIT;
  return Math.max(0, limit - playedTime.value);
});

// 检查是否需要进行实名认证
export function checkAuth() {
  const authInfo = getStorage('anti_addiction_auth', null);
  const today = new Date().toDateString();
  const todayPlayTime = getStorage(`play_time_${today}`, 0);
  
  playedTime.value = todayPlayTime;
  
  if (!authInfo) {
    age.value = null;
    return { needAuth: true };
  }
  
  age.value = authInfo.age;
  isAdult.value = authInfo.age >= 18;
  
  if (!isAdult.value) {
    const limit = DAILY_LIMIT;
    if (todayPlayTime >= limit) {
      showForceExit.value = true;
      return { forceExit: true };
    }
  }
  
  // 检查宵禁时间（22:00-8:00）
  if (!isAdult.value) {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 8) {
      showToast('每日22:00-次日8:00无法游戏', 'none');
      exitMiniProgram();
      return { curfew: true };
    }
  }
  
  return { needAuth: false };
}

// 开始实名认证
export function startAuth(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isWechat) {
      // 非微信环境，模拟认证
      const authInfo = {
        age: 25,
        authTime: Date.now(),
      };
      setStorage('anti_addiction_auth', authInfo);
      isAdult.value = true;
      age.value = 25;
      resolve(true);
      return;
    }
    
    // 调用微信实名认证
    // @ts-ignore
    wx.startRealNameAuth({
      success: (res: any) => {
        console.log('实名认证成功:', res);
        const authInfo = {
          age: 25,
          authTime: Date.now(),
        };
        setStorage('anti_addiction_auth', authInfo);
        isAdult.value = true;
        age.value = 25;
        showToast('认证成功', 'success');
        resolve(true);
      },
      fail: (err: any) => {
        console.error('实名认证失败:', err);
        showToast('认证失败，请重试', 'none');
        resolve(false);
      },
    });
  });
}

// 游客试玩
export function playAsGuest() {
  const authInfo = {
    age: 16,
    isGuest: true,
    authTime: Date.now(),
  };
  setStorage('anti_addiction_auth', authInfo);
  isAdult.value = false;
  age.value = 16;
  showToast('游客模式：限时15分钟', 'none');
}

// 开始记录游戏时长
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
      }
    }
  }, 60000);
}

// 停止记录游戏时长
export function stopPlayTimeTracking() {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
}

// 退出游戏
export function exitGame() {
  exitMiniProgram();
}

// 获取状态
export function getAntiAddictionState() {
  return {
    isAdult: isAdult.value,
    age: age.value,
    playedTime: playedTime.value,
    remainingTime: remainingTime.value,
    showForceExit: showForceExit.value,
  };
}
