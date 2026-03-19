import Phaser from 'phaser';
import type { LevelData } from '../data/levels';

interface GameCallbacks {
  onDifferenceFound: () => void;
  onWrongClick: () => void;
}

export class GameEngine {
  private game: Phaser.Game;
  private scene: Phaser.Scene | null = null;
  private callbacks: GameCallbacks;
  private foundDifferences: Set<number> = new Set();
  private currentLevelData: LevelData | null = null;
  private scale = 1;

  constructor(container: HTMLElement, callbacks: GameCallbacks) {
    this.callbacks = callbacks;
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      width: 1920,
      height: 1080,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
      },
      backgroundColor: '#0d0d1a',
    };

    this.game = new Phaser.Game(config);
  }

  private preload() {
    // 资源在loadLevel时动态加载
  }

  private create() {
    this.scene = this.game.scene.scenes[0];
    
    // 添加点击事件监听
    this.scene.input.on('pointerdown', this.handleClick.bind(this));
  }

  private update() {
    // 游戏循环更新
  }

  loadLevel(levelData: LevelData | undefined) {
    if (!this.scene || !levelData) return;

    this.currentLevelData = levelData;
    this.foundDifferences.clear();
    
    const scene = this.scene;
    
    // 清除旧内容
    scene.children.removeAll();
    
    // 加载图片资源
    scene.load.image('imageA', levelData.imageA);
    scene.load.image('imageB', levelData.imageB);
    
    scene.load.once('complete', () => {
      this.displayImages();
    });
    
    scene.load.start();
  }

  private displayImages() {
    if (!this.scene || !this.currentLevelData) return;

    const scene = this.scene;
    const { width, height } = scene.scale;
    
    // 计算缩放比例以适应屏幕
    const padding = 40;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    
    // 并排显示两张图
    const imgScale = Math.min(
      (availableWidth / 2) / 1920,
      availableHeight / 1080
    ) * 0.95;
    
    this.scale = imgScale;
    
    const gap = 20;
    const totalWidth = 1920 * imgScale * 2 + gap;
    const startX = (width - totalWidth) / 2 + 1920 * imgScale / 2;
    const centerY = height / 2;
    
    // 左图 (A图 - 原图)
    const imgA = scene.add.image(startX, centerY, 'imageA');
    imgA.setScale(imgScale);
    
    // 右图 (B图 - 有差异的图)
    const imgB = scene.add.image(startX + 1920 * imgScale + gap, centerY, 'imageB');
    imgB.setScale(imgScale);
    
    // 添加图标签
    const labelStyle = {
      fontSize: `${24 * imgScale}px`,
      color: '#d4a574',
      fontFamily: 'Arial',
    };
    
    scene.add.text(startX, centerY - 1080 * imgScale / 2 - 30 * imgScale, '原图', labelStyle)
      .setOrigin(0.5);
    scene.add.text(startX + 1920 * imgScale + gap, centerY - 1080 * imgScale / 2 - 30 * imgScale, '差异图', labelStyle)
      .setOrigin(0.5);
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    if (!this.scene || !this.currentLevelData) return;
    
    const scene = this.scene;
    const differences = this.currentLevelData.differences;
    
    // 计算点击位置对应的图片坐标
    const { width, height } = scene.scale;
    const padding = 40;
    const availableWidth = width - padding * 2;
    const gap = 20;
    const imgScale = Math.min(
      (availableWidth / 2) / 1920,
      (height - padding * 2) / 1080
    ) * 0.95;
    
    const totalWidth = 1920 * imgScale * 2 + gap;
    const startX = (width - totalWidth) / 2;
    const imgAY = height / 2 - 1080 * imgScale / 2;
    const imgBY = height / 2 - 1080 * imgScale / 2;
    
    const imgAEndX = startX + 1920 * imgScale;
    const imgBStartX = imgAEndX + gap;
    const imgBEndX = imgBStartX + 1920 * imgScale;
    
    // 检查点击是否在图片区域内
    const clickX = pointer.x;
    const clickY = pointer.y;
    
    let clickedOnImageB = false;
    
    // 检查是否点击在右图（差异图）上
    if (clickX >= imgBStartX && clickX <= imgBEndX && 
        clickY >= imgBY && clickY <= imgBY + 1080 * imgScale) {
      clickedOnImageB = true;
    }
    
    // 检测点击位置是否在差异区域内
    let found = false;
    
    differences.forEach((diff, index) => {
      if (this.foundDifferences.has(index)) return;
      
      // 只检测右图（差异图）上的点击
      if (!clickedOnImageB) return;
      
      // 将差异点坐标转换为屏幕坐标
      const diffScreenX = imgBStartX + diff.x * imgScale;
      const diffScreenY = imgBY + diff.y * imgScale;
      
      const dx = clickX - diffScreenX;
      const dy = clickY - diffScreenY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= diff.radius * imgScale) {
        this.foundDifferences.add(index);
        this.showFoundEffect(diffScreenX, diffScreenY, diff.radius * imgScale);
        this.callbacks.onDifferenceFound();
        found = true;
      }
    });
    
    if (!found) {
      this.showWrongEffect(clickX, clickY);
      this.callbacks.onWrongClick();
    }
  }

  private showFoundEffect(x: number, y: number, radius: number) {
    if (!this.scene) return;
    
    // 显示正确标记圆圈
    const circle = this.scene.add.circle(x, y, radius + 5);
    circle.setStrokeStyle(4, 0x4ade80);
    circle.setAlpha(0.8);
    
    // 中心对勾
    const check = this.scene.add.text(x, y, '✓', {
      fontSize: `${radius}px`,
      color: '#4ade80',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    
    // 动画效果
    this.scene.tweens.add({
      targets: [circle, check],
      scale: { from: 0.5, to: 1.2 },
      alpha: { from: 1, to: 0 },
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        circle.destroy();
        check.destroy();
      }
    });
    
    // 粒子效果
    this.createParticles(x, y, 0x4ade80);
  }

  private showWrongEffect(x: number, y: number) {
    if (!this.scene) return;
    
    // 屏幕轻微震动
    this.scene.cameras.main.shake(100, 0.005);
    
    // 显示错误标记
    const cross = this.scene.add.text(x, y, '✗', {
      fontSize: '40px',
      color: '#ff4444',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: cross,
      alpha: 0,
      y: y - 30,
      duration: 400,
      ease: 'Power2',
      onComplete: () => cross.destroy(),
    });
  }

  private createParticles(x: number, y: number, color: number) {
    if (!this.scene) return;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      
      const particle = this.scene.add.circle(x, y, 4, color);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  showHint() {
    if (!this.scene || !this.currentLevelData) return;
    
    const differences = this.currentLevelData.differences;
    
    // 找到第一个未发现的差异
    for (let i = 0; i < differences.length; i++) {
      if (!this.foundDifferences.has(i)) {
        const diff = differences[i];
        
        // 计算差异点在屏幕上的位置
        const { width, height } = this.scene.scale;
        const padding = 40;
        const availableWidth = width - padding * 2;
        const gap = 20;
        const imgScale = Math.min(
          (availableWidth / 2) / 1920,
          (height - padding * 2) / 1080
        ) * 0.95;
        
        const totalWidth = 1920 * imgScale * 2 + gap;
        const startX = (width - totalWidth) / 2;
        const imgBStartX = startX + 1920 * imgScale + gap;
        const imgBY = height / 2 - 1080 * imgScale / 2;
        
        const hintX = imgBStartX + diff.x * imgScale;
        const hintY = imgBY + diff.y * imgScale;
        
        // 显示提示圈
        const hint = this.scene.add.circle(hintX, hintY, diff.radius * imgScale + 10);
        hint.setStrokeStyle(3, 0xffd700);
        
        // 闪烁效果
        this.scene.tweens.add({
          targets: hint,
          alpha: 0,
          scale: 1.2,
          duration: 400,
          yoyo: true,
          repeat: 3,
          onComplete: () => hint.destroy(),
        });
        
        break;
      }
    }
  }

  destroy() {
    this.game.destroy(true);
  }
}
