# 🔍 找茬侦探社

一款侦探题材的H5找茬解谜游戏。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **游戏引擎**: Phaser 3
- **状态管理**: Pinia
- **构建工具**: Vite

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 项目结构

```
detective-spot/
├── src/
│   ├── components/      # Vue组件
│   │   ├── GameScene.vue
│   │   ├── LevelCompleteModal.vue
│   │   └── LevelFailedModal.vue
│   ├── game/            # 游戏逻辑
│   │   └── GameEngine.ts
│   ├── stores/          # Pinia状态
│   │   └── gameStore.ts
│   ├── assets/          # 游戏资源
│   │   └── levels/      # 关卡图片
│   ├── App.vue
│   └── main.ts
├── docs/
│   └── art-requirements.md  # 美术需求文档
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 游戏玩法

1. 对比左右两张图片，找出差异之处
2. 点击差异位置进行标记
3. 在限定时间内找出所有差异
4. 剩余时间越多，获得星级越高

## 美术资源

详见 [docs/art-requirements.md](./docs/art-requirements.md)

## 部署

构建后的文件位于 `dist/` 目录，可直接部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- 微信小游戏/抖音小游戏平台

## 版权

© 2026 找茬侦探社 - All Rights Reserved
