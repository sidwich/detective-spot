// 音效管理器 - 使用Web Audio API生成简单音效
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private musicEnabled = true;

  constructor() {
    // 延迟初始化AudioContext，等待用户交互
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  // 播放找对音效 - 清脆的上升音
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.5, this.ctx.currentTime + 0.1); // C6

    gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + 0.3);
  }

  // 播放错误音效 - 低沉的嗡嗡声
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, this.ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + 0.2);
  }

  // 播放提示音效
  playHint() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, this.ctx.currentTime);
    oscillator.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + 0.3);
  }

  // 播放关卡完成音效
  playLevelComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.1);

      gainNode.gain.setValueAtTime(0, this.ctx!.currentTime + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + index * 0.1 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + index * 0.1 + 0.4);

      oscillator.start(this.ctx!.currentTime + index * 0.1);
      oscillator.stop(this.ctx!.currentTime + index * 0.1 + 0.4);
    });
  }

  // 播放游戏结束音效
  playGameOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [349.23, 329.63, 293.66, 261.63]; // F4, E4, D4, C4
    
    notes.forEach((freq, index) => {
      const oscillator = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.15);

      gainNode.gain.setValueAtTime(0.2, this.ctx!.currentTime + index * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + index * 0.15 + 0.3);

      oscillator.start(this.ctx!.currentTime + index * 0.15);
      oscillator.stop(this.ctx!.currentTime + index * 0.15 + 0.3);
    });
  }

  // 播放按钮点击音效
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + 0.1);
  }
}

export const soundManager = new SoundManager();
