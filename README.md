# 🔍 找茬侦探社

一款考验观察力的H5找茬解谜游戏，支持微信小游戏平台。

[English](#english) | [中文](#中文)

---

## 中文

### 🎮 游戏特色

- **20个精心关卡**：从简单到困难，循序渐进挑战眼力
- **侦探主题**：独特的侦探社背景设定，沉浸式解谜体验
- **星级评价**：根据通关速度获得1-3星评价
- **提示系统**：卡关时使用提示道具
- **成就系统**：收集星星，解锁更多关卡
- **跨平台**：支持Web和微信小游戏

### 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/sidwich/detective-spot.git
cd detective-spot

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

### 📁 项目结构

```
src/
├── components/          # Vue组件
│   ├── AntiAddiction.vue    # 防沉迷系统
│   ├── GameScene.vue        # 游戏主场景
│   ├── MainMenu.vue         # 主菜单
│   ├── LevelSelect.vue      # 关卡选择
│   └── ...
├── data/
│   └── levels.ts        # 20个关卡数据
├── game/
│   ├── GameEngine.ts    # Phaser游戏引擎
│   └── SoundManager.ts  # 音效管理
├── platform/            # 微信小游戏适配
│   ├── wechat.ts        # 微信SDK封装
│   └── share.ts         # 分享功能
└── stores/
    └── gameStore.ts     # 状态管理
```

### 🛠️ 技术栈

- **前端框架**：Vue 3 + TypeScript
- **游戏引擎**：Phaser 3
- **状态管理**：Pinia
- **构建工具**：Vite
- **样式**：原生CSS

### 📱 微信小游戏发布

完整的发布指南请查看 [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)

主要步骤：
1. 注册微信小程序账号（服务类目选"游戏"）
2. 完成ICP备案
3. 申请软件著作权
4. 配置隐私政策
5. 使用微信开发者工具上传代码
6. 提交审核并发布

### ⚙️ 微信小游戏适配功能

- ✅ 微信登录与用户信息获取
- ✅ 分享功能（好友/朋友圈）
- ✅ 防沉迷系统（实名认证、时长限制）
- ✅ 本地存储（游戏进度保存）
- ✅ 震动反馈
- ✅ 内存优化
- ✅ 自动更新检查

### 📄 隐私政策

隐私政策页面位于 `privacy/index.html`，请部署到服务器后在微信后台配置URL。

### 🤝 贡献

欢迎提交Issue和Pull Request！

### 📄 许可证

MIT License

---

## English

### 🎮 Features

- **20 Carefully Designed Levels**: From easy to hard, challenge your observation skills
- **Detective Theme**: Unique detective agency setting, immersive puzzle experience
- **Star Rating**: Earn 1-3 stars based on completion speed
- **Hint System**: Use hints when stuck
- **Achievement System**: Collect stars and unlock more levels
- **Cross-Platform**: Support Web and WeChat Mini Games

### 🚀 Quick Start

```bash
# Clone
git clone https://github.com/sidwich/detective-spot.git
cd detective-spot

# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

### 📱 WeChat Mini Game

See [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for detailed publishing guide.

### 📄 License

MIT License

---

## 🙏 Credits

Created by Kimi Claw

© 2026 找茬侦探社. All rights reserved.
