/**
 * 分享功能模块
 * 提供分享图生成、分享数据统计等功能
 */

import { isWechat, shareAppMessage, showToast } from './wechat';

// 分享文案模板
const shareTemplates = [
  {
    title: '🔍 我在找茬侦探社破了{level}个案子，来挑战我！',
    imageUrl: '',
  },
  {
    title: '🕵️ 侦探眼力大考验！我已经找到{found}处不同，你呢？',
    imageUrl: '',
  },
  {
    title: '👀 99%的人都找不全！你能找出所有不同吗？',
    imageUrl: '',
  },
  {
    title: '🏆 我在{level}关卡获得了{stars}星评价，不服来战！',
    imageUrl: '',
  },
  {
    title: '⏰ 还剩{time}秒就通关了！这关太难了，求助大神！',
    imageUrl: '',
  },
];

interface ShareData {
  level?: number;
  found?: number;
  stars?: number;
  time?: number;
  score?: number;
}

// 获取分享文案
export function getShareText(data: ShareData = {}): string {
  const template = shareTemplates[Math.floor(Math.random() * shareTemplates.length)];
  
  return template.title
    .replace('{level}', String(data.level || 1))
    .replace('{found}', String(data.found || 0))
    .replace('{stars}', String(data.stars || 0))
    .replace('{time}', String(data.time || 0))
    .replace('{score}', String(data.score || 0));
}

// 生成分享图（使用Canvas）
export async function generateShareImage(data: ShareData = {}): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // 设置画布尺寸（微信朋友圈推荐尺寸 5:4）
  canvas.width = 500;
  canvas.height = 400;
  
  // 绘制背景
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 500, 400);
  
  // 绘制边框
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 480, 380);
  
  // 绘制标题
  ctx.fillStyle = '#d4a574';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('找茬侦探社', 250, 80);
  
  // 绘制分隔线
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(400, 100);
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 绘制成绩信息
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  
  let y = 150;
  if (data.level) {
    ctx.fillText(`🎮 当前关卡：第 ${data.level} 关`, 80, y);
    y += 50;
  }
  if (data.stars) {
    ctx.fillText(`⭐ 获得评价：${'⭐'.repeat(data.stars)}`, 80, y);
    y += 50;
  }
  if (data.score) {
    ctx.fillText(`🏆 总分：${data.score}`, 80, y);
    y += 50;
  }
  
  // 绘制号召性用语
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('👇 长按识别，一起挑战！', 250, 340);
  
  // 绘制二维码区域占位
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(350, 250, 100, 100);
  ctx.fillStyle = '#888';
  ctx.font = '14px Arial';
  ctx.fillText('二维码', 400, 305);
  
  // 返回图片数据
  return canvas.toDataURL('image/png');
}

// 分享到好友
export function shareToFriend(data: ShareData = {}) {
  const title = getShareText(data);
  
  shareAppMessage({
    title,
    query: `level=${data.level || 1}&invite=true`,
  });
}

// 分享到朋友圈（仅微信小游戏支持）
export function shareToTimeline(data: ShareData = {}) {
  if (!isWechat) {
    showToast('请使用微信分享', 'none');
    return;
  }
  
  // @ts-ignore
  wx.shareToTimeline({
    title: getShareText(data),
    query: `level=${data.level || 1}`,
  });
}

// 求助分享（当玩家卡关时）
export function shareForHelp(level: number, remainingTime: number) {
  const title = `🆘 我在第${level}关卡住了！还剩${remainingTime}秒，求大神指点！`;
  
  shareAppMessage({
    title,
    query: `help=true&level=${level}`,
  });
}

// 炫耀成绩分享
export function shareAchievement(level: number, stars: number, time: number) {
  const title = `🏆 完美！我在第${level}关获得${stars}星，仅用${time}秒！`;
  
  shareAppMessage({
    title,
    query: `achievement=true&level=${level}&stars=${stars}`,
  });
}

// 邀请好友一起玩
export function inviteFriends() {
  shareAppMessage({
    title: '🔍 找茬侦探社 - 一款考验眼力的解谜游戏，快来一起破案！',
    query: 'invite=true',
  });
}

// 解析分享参数
export function parseShareQuery(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (!query) return params;
  
  query.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  
  return params;
}

// 处理分享进入的逻辑
export function handleShareEntry(query: Record<string, string>) {
  if (query.help === 'true') {
    // 玩家是来帮忙的
    console.log(`帮助玩家通过第${query.level}关`);
    return { type: 'help', level: parseInt(query.level || '1') };
  }
  
  if (query.achievement === 'true') {
    // 查看成就
    console.log(`查看第${query.level}关${query.stars}星成就`);
    return { type: 'achievement', level: parseInt(query.level || '1'), stars: parseInt(query.stars || '0') };
  }
  
  if (query.invite === 'true') {
    // 被邀请进入
    console.log('被邀请进入游戏');
    return { type: 'invite' };
  }
  
  return { type: 'normal' };
}

// 记录分享事件
export function logShareEvent(scene: string, data?: ShareData) {
  console.log('分享事件:', scene, data);
  
  // 这里可以接入数据分析平台
  if (isWechat) {
    // @ts-ignore
    wx.reportAnalytics('share', {
      scene,
      level: String(data?.level || 0),
      stars: String(data?.stars || 0),
    });
  }
}
