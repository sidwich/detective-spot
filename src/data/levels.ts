/**
 * 关卡数据配置 - 20个关卡
 * 每个关卡包含左右两图的差异区域坐标
 */

export interface Difference {
  x: number;      // 差异中心X坐标 (基于1920x1080参考分辨率)
  y: number;      // 差异中心Y坐标
  radius: number; // 检测半径
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageA: string;
  imageB: string;
  differences: Difference[];
  diffCount: number;
  timeLimit: number;    // 时间限制(秒)
  hints: number;        // 可用提示次数
}

// 生成占位图URL (使用纯色背景+文字作为占位)
const getPlaceholderImage = (id: number, type: 'a' | 'b') => {
  const colors = ['1a1a2e', '16213e', '0f3460', '533483', 'e94560'];
  const color = colors[id % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
      <rect fill="#${color}" width="1920" height="1080"/>
      <text x="960" y="500" font-family="Arial" font-size="60" fill="#d4a574" text-anchor="middle">关卡 ${id}</text>
      <text x="960" y="600" font-family="Arial" font-size="40" fill="#888" text-anchor="middle">图 ${type.toUpperCase()}</text>
      ${generateRandomShapes(id, type)}
    </svg>`
  )}`;
};

// 生成随机图形作为差异占位
const generateRandomShapes = (levelId: number, type: 'a' | 'b'): string => {
  const shapes: string[] = [];
  const seed = levelId * 100 + (type === 'a' ? 0 : 1);
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  
  // 为每关生成一些随机形状
  for (let i = 0; i < 20; i++) {
    const x = 100 + pseudoRandom(i * 3) * 1720;
    const y = 100 + pseudoRandom(i * 3 + 1) * 880;
    const size = 30 + pseudoRandom(i * 3 + 2) * 70;
    const shapeType = Math.floor(pseudoRandom(i * 3 + 3) * 3);
    
    const colors = ['#d4a574', '#4ade80', '#ff6b6b', '#ffd700', '#8b5cf6'];
    const color = colors[i % colors.length];
    
    if (shapeType === 0) {
      shapes.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.3"/>`);
    } else if (shapeType === 1) {
      shapes.push(`<rect x="${x-size}" y="${y-size}" width="${size*2}" height="${size*2}" fill="${color}" opacity="0.3"/>`);
    } else {
      shapes.push(`<polygon points="${x},${y-size} ${x+size},${y+size} ${x-size},${y+size}" fill="${color}" opacity="0.3"/>`);
    }
  }
  
  return shapes.join('');
};

// 20个关卡数据
export const levelsData: LevelData[] = [
  // 简单关卡 (1-5)
  {
    id: 1,
    name: '侦探社入门',
    description: '欢迎来到找茬侦探社，先来个简单的热身吧！',
    difficulty: 'easy',
    imageA: getPlaceholderImage(1, 'a'),
    imageB: getPlaceholderImage(1, 'b'),
    differences: [
      { x: 300, y: 200, radius: 40 },
      { x: 800, y: 400, radius: 35 },
      { x: 1200, y: 300, radius: 45 },
      { x: 500, y: 700, radius: 40 },
      { x: 1500, y: 600, radius: 35 },
    ],
    diffCount: 5,
    timeLimit: 90,
    hints: 3,
  },
  {
    id: 2,
    name: '书房迷案',
    description: '书房里藏着什么秘密？',
    difficulty: 'easy',
    imageA: getPlaceholderImage(2, 'a'),
    imageB: getPlaceholderImage(2, 'b'),
    differences: [
      { x: 250, y: 250, radius: 35 },
      { x: 600, y: 350, radius: 40 },
      { x: 900, y: 550, radius: 35 },
      { x: 1300, y: 450, radius: 40 },
      { x: 1600, y: 750, radius: 35 },
    ],
    diffCount: 5,
    timeLimit: 85,
    hints: 3,
  },
  {
    id: 3,
    name: '咖啡馆疑云',
    description: '这家咖啡馆有些不对劲...',
    difficulty: 'easy',
    imageA: getPlaceholderImage(3, 'a'),
    imageB: getPlaceholderImage(3, 'b'),
    differences: [
      { x: 400, y: 300, radius: 40 },
      { x: 750, y: 500, radius: 35 },
      { x: 1100, y: 350, radius: 40 },
      { x: 1400, y: 650, radius: 35 },
      { x: 1700, y: 400, radius: 40 },
    ],
    diffCount: 5,
    timeLimit: 80,
    hints: 3,
  },
  {
    id: 4,
    name: '公园漫步',
    description: '阳光明媚的下午，公园里有什么异常？',
    difficulty: 'easy',
    imageA: getPlaceholderImage(4, 'a'),
    imageB: getPlaceholderImage(4, 'b'),
    differences: [
      { x: 200, y: 400, radius: 40 },
      { x: 550, y: 250, radius: 35 },
      { x: 950, y: 600, radius: 40 },
      { x: 1250, y: 350, radius: 35 },
      { x: 1650, y: 700, radius: 40 },
    ],
    diffCount: 5,
    timeLimit: 75,
    hints: 3,
  },
  {
    id: 5,
    name: '市场调查',
    description: '集市上人山人海，找出所有不同！',
    difficulty: 'easy',
    imageA: getPlaceholderImage(5, 'a'),
    imageB: getPlaceholderImage(5, 'b'),
    differences: [
      { x: 350, y: 350, radius: 35 },
      { x: 700, y: 450, radius: 40 },
      { x: 1000, y: 280, radius: 35 },
      { x: 1350, y: 550, radius: 40 },
      { x: 1700, y: 350, radius: 35 },
    ],
    diffCount: 5,
    timeLimit: 70,
    hints: 3,
  },
  
  // 中等关卡 (6-12)
  {
    id: 6,
    name: '博物馆之夜',
    description: '博物馆闭馆后发生了什么？',
    difficulty: 'medium',
    imageA: getPlaceholderImage(6, 'a'),
    imageB: getPlaceholderImage(6, 'b'),
    differences: [
      { x: 280, y: 200, radius: 30 },
      { x: 550, y: 380, radius: 35 },
      { x: 850, y: 520, radius: 30 },
      { x: 1100, y: 320, radius: 35 },
      { x: 1450, y: 480, radius: 30 },
      { x: 1750, y: 720, radius: 35 },
    ],
    diffCount: 6,
    timeLimit: 90,
    hints: 2,
  },
  {
    id: 7,
    name: '图书馆密语',
    description: '书架之间隐藏着线索...',
    difficulty: 'medium',
    imageA: getPlaceholderImage(7, 'a'),
    imageB: getPlaceholderImage(7, 'b'),
    differences: [
      { x: 320, y: 280, radius: 35 },
      { x: 600, y: 420, radius: 30 },
      { x: 880, y: 320, radius: 35 },
      { x: 1150, y: 580, radius: 30 },
      { x: 1420, y: 380, radius: 35 },
      { x: 1680, y: 650, radius: 30 },
    ],
    diffCount: 6,
    timeLimit: 85,
    hints: 2,
  },
  {
    id: 8,
    name: '火车站追踪',
    description: '嫌疑人出现在火车站，快找出线索！',
    difficulty: 'medium',
    imageA: getPlaceholderImage(8, 'a'),
    imageB: getPlaceholderImage(8, 'b'),
    differences: [
      { x: 250, y: 320, radius: 30 },
      { x: 520, y: 480, radius: 35 },
      { x: 820, y: 280, radius: 30 },
      { x: 1080, y: 520, radius: 35 },
      { x: 1380, y: 360, radius: 30 },
      { x: 1620, y: 680, radius: 35 },
    ],
    diffCount: 6,
    timeLimit: 80,
    hints: 2,
  },
  {
    id: 9,
    name: '游乐园之谜',
    description: '欢乐的背后藏着什么秘密？',
    difficulty: 'medium',
    imageA: getPlaceholderImage(9, 'a'),
    imageB: getPlaceholderImage(9, 'b'),
    differences: [
      { x: 380, y: 240, radius: 35 },
      { x: 650, y: 440, radius: 30 },
      { x: 920, y: 360, radius: 35 },
      { x: 1200, y: 560, radius: 30 },
      { x: 1480, y: 320, radius: 35 },
      { x: 1720, y: 600, radius: 30 },
    ],
    diffCount: 6,
    timeLimit: 75,
    hints: 2,
  },
  {
    id: 10,
    name: '医院走廊',
    description: '深夜的医院，似乎有些不寻常...',
    difficulty: 'medium',
    imageA: getPlaceholderImage(10, 'a'),
    imageB: getPlaceholderImage(10, 'b'),
    differences: [
      { x: 300, y: 360, radius: 30 },
      { x: 580, y: 280, radius: 35 },
      { x: 860, y: 500, radius: 30 },
      { x: 1140, y: 380, radius: 35 },
      { x: 1420, y: 620, radius: 30 },
      { x: 1700, y: 340, radius: 35 },
    ],
    diffCount: 6,
    timeLimit: 70,
    hints: 2,
  },
  {
    id: 11,
    name: '海滩疑案',
    description: '阳光沙滩下藏着什么？',
    difficulty: 'medium',
    imageA: getPlaceholderImage(11, 'a'),
    imageB: getPlaceholderImage(11, 'b'),
    differences: [
      { x: 220, y: 280, radius: 35 },
      { x: 480, y: 520, radius: 30 },
      { x: 780, y: 340, radius: 35 },
      { x: 1060, y: 580, radius: 30 },
      { x: 1340, y: 400, radius: 35 },
      { x: 1620, y: 660, radius: 30 },
    ],
    diffCount: 6,
    timeLimit: 70,
    hints: 2,
  },
  {
    id: 12,
    name: '古堡探险',
    description: '古老的城堡里充满了谜团',
    difficulty: 'medium',
    imageA: getPlaceholderImage(12, 'a'),
    imageB: getPlaceholderImage(12, 'b'),
    differences: [
      { x: 340, y: 320, radius: 30 },
      { x: 620, y: 460, radius: 35 },
      { x: 900, y: 280, radius: 30 },
      { x: 1180, y: 540, radius: 35 },
      { x: 1460, y: 360, radius: 30 },
      { x: 1740, y: 640, radius: 35 },
    ],
    diffCount: 6,
    timeLimit: 65,
    hints: 2,
  },
  
  // 困难关卡 (13-20)
  {
    id: 13,
    name: '实验室机密',
    description: '高级实验室的安保系统被触发了！',
    difficulty: 'hard',
    imageA: getPlaceholderImage(13, 'a'),
    imageB: getPlaceholderImage(13, 'b'),
    differences: [
      { x: 200, y: 240, radius: 25 },
      { x: 450, y: 400, radius: 30 },
      { x: 720, y: 320, radius: 25 },
      { x: 980, y: 560, radius: 30 },
      { x: 1250, y: 280, radius: 25 },
      { x: 1520, y: 520, radius: 30 },
      { x: 1780, y: 720, radius: 25 },
    ],
    diffCount: 7,
    timeLimit: 80,
    hints: 1,
  },
  {
    id: 14,
    name: '夜店追踪',
    description: '霓虹灯下，找出隐藏的目标',
    difficulty: 'hard',
    imageA: getPlaceholderImage(14, 'a'),
    imageB: getPlaceholderImage(14, 'b'),
    differences: [
      { x: 280, y: 300, radius: 30 },
      { x: 520, y: 480, radius: 25 },
      { x: 800, y: 360, radius: 30 },
      { x: 1080, y: 600, radius: 25 },
      { x: 1360, y: 320, radius: 30 },
      { x: 1580, y: 560, radius: 25 },
      { x: 1800, y: 680, radius: 30 },
    ],
    diffCount: 7,
    timeLimit: 75,
    hints: 1,
  },
  {
    id: 15,
    name: '太空站危机',
    description: '零重力环境下，任何异常都可能致命',
    difficulty: 'hard',
    imageA: getPlaceholderImage(15, 'a'),
    imageB: getPlaceholderImage(15, 'b'),
    differences: [
      { x: 320, y: 260, radius: 25 },
      { x: 580, y: 440, radius: 30 },
      { x: 860, y: 340, radius: 25 },
      { x: 1140, y: 580, radius: 30 },
      { x: 1380, y: 380, radius: 25 },
      { x: 1620, y: 620, radius: 30 },
      { x: 1820, y: 720, radius: 25 },
    ],
    diffCount: 7,
    timeLimit: 70,
    hints: 1,
  },
  {
    id: 16,
    name: '银行大劫案',
    description: '金库被入侵，找出所有破坏痕迹',
    difficulty: 'hard',
    imageA: getPlaceholderImage(16, 'a'),
    imageB: getPlaceholderImage(16, 'b'),
    differences: [
      { x: 240, y: 320, radius: 30 },
      { x: 500, y: 240, radius: 25 },
      { x: 780, y: 480, radius: 30 },
      { x: 1060, y: 360, radius: 25 },
      { x: 1300, y: 600, radius: 30 },
      { x: 1540, y: 280, radius: 25 },
      { x: 1760, y: 680, radius: 30 },
    ],
    diffCount: 7,
    timeLimit: 70,
    hints: 1,
  },
  {
    id: 17,
    name: '地下基地',
    description: '深入敌后，发现隐藏的真相',
    difficulty: 'hard',
    imageA: getPlaceholderImage(17, 'a'),
    imageB: getPlaceholderImage(17, 'b'),
    differences: [
      { x: 300, y: 280, radius: 25 },
      { x: 560, y: 460, radius: 30 },
      { x: 840, y: 320, radius: 25 },
      { x: 1120, y: 580, radius: 30 },
      { x: 1360, y: 400, radius: 25 },
      { x: 1600, y: 640, radius: 30 },
      { x: 1840, y: 720, radius: 25 },
    ],
    diffCount: 7,
    timeLimit: 65,
    hints: 1,
  },
  {
    id: 18,
    name: '终极谜题',
    description: '最后的考验，你能通过吗？',
    difficulty: 'hard',
    imageA: getPlaceholderImage(18, 'a'),
    imageB: getPlaceholderImage(18, 'b'),
    differences: [
      { x: 260, y: 340, radius: 30 },
      { x: 540, y: 260, radius: 25 },
      { x: 820, y: 500, radius: 30 },
      { x: 1100, y: 380, radius: 25 },
      { x: 1340, y: 620, radius: 30 },
      { x: 1580, y: 300, radius: 25 },
      { x: 1820, y: 700, radius: 30 },
      { x: 180, y: 580, radius: 25 },
    ],
    diffCount: 8,
    timeLimit: 80,
    hints: 1,
  },
  {
    id: 19,
    name: '时间陷阱',
    description: '时间紧迫，每一秒都至关重要',
    difficulty: 'hard',
    imageA: getPlaceholderImage(19, 'a'),
    imageB: getPlaceholderImage(19, 'b'),
    differences: [
      { x: 220, y: 260, radius: 25 },
      { x: 480, y: 440, radius: 30 },
      { x: 760, y: 340, radius: 25 },
      { x: 1040, y: 560, radius: 30 },
      { x: 1320, y: 300, radius: 25 },
      { x: 1560, y: 600, radius: 30 },
      { x: 1780, y: 740, radius: 25 },
      { x: 160, y: 640, radius: 30 },
    ],
    diffCount: 8,
    timeLimit: 70,
    hints: 1,
  },
  {
    id: 20,
    name: '侦探大师',
    description: '恭喜你来到这里！这是终极挑战，证明你是真正的找茬大师！',
    difficulty: 'hard',
    imageA: getPlaceholderImage(20, 'a'),
    imageB: getPlaceholderImage(20, 'b'),
    differences: [
      { x: 180, y: 300, radius: 25 },
      { x: 420, y: 480, radius: 30 },
      { x: 700, y: 280, radius: 25 },
      { x: 980, y: 540, radius: 30 },
      { x: 1260, y: 360, radius: 25 },
      { x: 1500, y: 620, radius: 30 },
      { x: 1740, y: 720, radius: 25 },
      { x: 140, y: 680, radius: 30 },
      { x: 1860, y: 200, radius: 25 },
    ],
    diffCount: 9,
    timeLimit: 90,
    hints: 1,
  },
];

export default levelsData;
