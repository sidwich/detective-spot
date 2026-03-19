import Phaser from 'phaser';

interface GameCallbacks {
  onDifferenceFound: () => void;
  onWrongClick: () => void;
}

export class GameEngine {
  private game: Phaser.Game;
  private scene: Phaser.Scene | null = null;
  private callbacks: GameCallbacks;
  private foundDifferences: Set<number> = new Set();
  private hintGraphics: Phaser.GameObjects.Graphics | null = null;

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

  loadLevel(levelData: any) {
    if (!this.scene) return;

    this.foundDifferences.clear();
    
    const scene = this.scene;
    
    // 清除旧内容
    scene.children.removeAll();
    
    // 加载并显示图片
    const { width, height } = scene.scale;
    
    // 加载图片资源
    scene.load.image('imageA', levelData.imageA);
    scene.load.image('imageB', levelData.imageB);
    
    scene.load.once('complete', () => {
      // 显示图片（并排或叠加模式）
      // 这里使用并排模式
      const scale = Math.min(
        (width * 0.45) / 1920,
        height / 1080
      );
      
      const imgA = scene.add.image(width * 0.25, height * 0.5, 'imageA');
      imgA.setScale(scale);
      
      const imgB = scene.add.image(width * 0.75, height * 0.5, 'imageB');
      imgB.setScale(scale);
      
      // 存储差异数据
      (scene as any).differences = levelData.differences;
      (scene as any).scale = scale;
    });
    
    scene.load.start();
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    if (!this.scene) return;
    
    const scene = this.scene;
    const differences = (scene as any).differences || [];
    const scale = (scene as any).scale || 1;
    
    // 检测点击位置是否在差异区域内
    let found = false;
    
    differences.forEach((diff: any, index: number) => {
      if (this.foundDifferences.has(index)) return;
      
      // 根据图片位置调整坐标
      const imgBX = scene.scale.width * 0.75;
      const imgBY = scene.scale.height * 0.5;
      
      const dx = pointer.x - (imgBX + (diff.x - 960) * scale);
      const dy = pointer.y - (imgBY + (diff.y - 540) * scale);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= diff.radius * scale) {
        this.foundDifferences.add(index);
        this.showFoundEffect(pointer.x, pointer.y);
        this.callbacks.onDifferenceFound();
        found = true;
      }
    });
    
    if (!found) {
      this.showWrongEffect(pointer.x, pointer.y);
      this.callbacks.onWrongClick();
    }
  }

  private showFoundEffect(x: number, y: number) {
    if (!this.scene) return;
    
    // 显示正确标记
    const circle = this.scene.add.circle(x, y, 30, 0x4ade80, 0.5);
    const check = this.scene.add.text(x, y, '✓', {
      fontSize: '40px',
      color: '#4ade80',
    }).setOrigin(0.5);
    
    // 动画效果
    this.scene.tweens.add({
      targets: [circle, check],
      scale: { from: 0, to: 1 },
      duration: 300,
      ease: 'Back.out',
    });
  }

  private showWrongEffect(x: number, y: number) {
    if (!this.scene) return;
    
    // 屏幕轻微震动
    this.scene.cameras.main.shake(100, 0.01);
    
    // 显示错误标记
    const cross = this.scene.add.text(x, y, '✗', {
      fontSize: '30px',
      color: '#ff4444',
    }).setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: cross,
      alpha: 0,
      y: y - 50,
      duration: 500,
      onComplete: () => cross.destroy(),
    });
  }

  showHint() {
    if (!this.scene) return;
    
    const differences = (this.scene as any).differences || [];
    
    // 找到第一个未发现的差异
    for (let i = 0; i < differences.length; i++) {
      if (!this.foundDifferences.has(i)) {
        const diff = differences[i];
        const scale = (this.scene as any).scale || 1;
        const imgBX = this.scene.scale.width * 0.75;
        const imgBY = this.scene.scale.height * 0.5;
        
        const hintX = imgBX + (diff.x - 960) * scale;
        const hintY = imgBY + (diff.y - 540) * scale;
        
        // 显示提示圈
        const hint = this.scene.add.circle(hintX, hintY, diff.radius * scale);
        hint.setStrokeStyle(3, 0xffd700);
        
        // 闪烁效果
        this.scene.tweens.add({
          targets: hint,
          alpha: 0,
          duration: 500,
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
