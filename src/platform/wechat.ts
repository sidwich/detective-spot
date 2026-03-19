/**
 * 微信小游戏平台适配
 * 封装微信SDK，提供跨平台兼容的API
 */

// 判断是否在微信小游戏环境
export const isWechat = typeof wx !== 'undefined';

// 获取系统信息
export function getSystemInfo() {
  if (isWechat) {
    return wx.getSystemInfoSync();
  }
  return {
    platform: 'web',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };
}

// 微信登录
export function wxLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isWechat) {
      resolve('mock_openid_web_' + Date.now());
      return;
    }
    
    wx.login({
      success: (res) => {
        if (res.code) {
          // 将code发送到后端换取openid
          console.log('微信登录code:', res.code);
          resolve(res.code);
        } else {
          reject(new Error('登录失败'));
        }
      },
      fail: reject,
    });
  });
}

// 获取用户信息
export function getUserInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!isWechat) {
      resolve({
        nickName: '游客',
        avatarUrl: '',
      });
      return;
    }
    
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve(res.userInfo);
      },
      fail: reject,
    });
  });
}

// 分享到好友/群
interface ShareOptions {
  title?: string;
  imageUrl?: string;
  query?: string;
}

export function shareAppMessage(options: ShareOptions = {}) {
  if (!isWechat) {
    console.log('分享:', options);
    return;
  }
  
  wx.shareAppMessage({
    title: options.title || '找茬侦探社 - 来挑战你的观察力！',
    imageUrl: options.imageUrl || '',
    query: options.query || '',
  });
}

// 显示分享按钮
export function showShareMenu() {
  if (!isWechat) return;
  
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
  });
}

// 生成分享图
export async function createShareImage(canvas: HTMLCanvasElement): Promise<string> {
  if (!isWechat) {
    return canvas.toDataURL();
  }
  
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: reject,
    });
  });
}

// 存储数据到本地
export function setStorage(key: string, data: any) {
  if (isWechat) {
    wx.setStorageSync(key, data);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// 读取本地数据
export function getStorage(key: string, defaultValue?: any) {
  if (isWechat) {
    return wx.getStorageSync(key) || defaultValue;
  } else {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

// 震动反馈
export function vibrateShort() {
  if (isWechat) {
    wx.vibrateShort({ type: 'light' });
  }
}

export function vibrateLong() {
  if (isWechat) {
    wx.vibrateLong();
  }
}

// 显示Toast
export function showToast(title: string, icon: 'success' | 'loading' | 'none' = 'none') {
  if (isWechat) {
    wx.showToast({ title, icon });
  } else {
    alert(title);
  }
}

// 显示模态框
export function showModal(title: string, content: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (isWechat) {
      wx.showModal({
        title,
        content,
        success: (res) => {
          resolve(res.confirm);
        },
      });
    } else {
      resolve(confirm(content));
    }
  });
}

// 发起 HTTPS 请求
export function request(options: {
  url: string;
  method?: 'GET' | 'POST';
  data?: any;
  header?: Record<string, string>;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    if (isWechat) {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.header,
        success: (res) => resolve(res.data),
        fail: reject,
      });
    } else {
      fetch(options.url, {
        method: options.method || 'GET',
        headers: options.header,
        body: options.data ? JSON.stringify(options.data) : undefined,
      })
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    }
  });
}

// 打开设置
export function openSetting() {
  if (isWechat) {
    wx.openSetting();
  }
}

// 获取授权设置
export function getSetting(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (isWechat) {
      wx.getSetting({
        success: resolve,
        fail: reject,
      });
    } else {
      resolve({ authSetting: {} });
    }
  });
}

// 监听内存警告
export function onMemoryWarning(callback: (res: { level: number }) => void) {
  if (isWechat) {
    wx.onMemoryWarning(callback);
  }
}

// 退出小游戏
export function exitMiniProgram() {
  if (isWechat) {
    wx.exitMiniProgram();
  }
}

// 检查更新
export function checkForUpdate() {
  if (!isWechat) return;
  
  const updateManager = wx.getUpdateManager();
  
  updateManager.onCheckForUpdate((res) => {
    console.log('检查更新:', res.hasUpdate);
  });
  
  updateManager.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });
}

// 广告相关
interface AdOptions {
  adUnitId: string;
}

export function createBannerAd(options: AdOptions) {
  if (!isWechat) return null;
  
  return wx.createBannerAd({
    adUnitId: options.adUnitId,
    style: {
      left: 10,
      top: 0,
      width: 320,
    },
  });
}

export function createRewardedVideoAd(options: AdOptions) {
  if (!isWechat) return null;
  
  return wx.createRewardedVideoAd({
    adUnitId: options.adUnitId,
  });
}

export function createInterstitialAd(options: AdOptions) {
  if (!isWechat) return null;
  
  return wx.createInterstitialAd({
    adUnitId: options.adUnitId,
  });
}
