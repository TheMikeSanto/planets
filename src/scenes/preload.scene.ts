import * as Phaser from 'phaser';

import {
  ASSET_KEYS,
  DebrisType,
} from '../debris';
export class PreloadScene extends Phaser.Scene {

  constructor() {
    super('preloadScene');
  }

  public preload(): void {
    const { width, height } = this.scale;
    this.scale.lockOrientation('landscape');
    const loadingIndicator = this.add.text(width / 2, height / 2, 'loading', {
      font: 'bold 24px Arial',
    }).setAlpha(0);
    this.tweens.add({
      targets: loadingIndicator,
      alpha: { value: 1, duration: 1000, ease: 'Power1' },
      yoyo: true,
      loop: -1,
    });
    this.loadAssets();
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('titleScene');
    });
  }

  private loadAssets(): void {
    ASSET_KEYS[DebrisType.Default].forEach(key => {
      this.load.image(key, `assets/debris/${key}.png`);
    });
    ASSET_KEYS[DebrisType.Special].forEach(key => {
      this.load.image(key, `assets/debris/special/${key}.png`);
    });
    this.load.image('background-game-over', 'assets/game-over-bg.png');
    this.load.image('big-planet', 'assets/big_planet.png');
    this.load.image('clouds', 'assets/clouds1.png');
    this.load.image('barrier', 'assets/barrier.png');
    this.load.spritesheet('player', 'assets/player/ship.png',
      { frameWidth: 150 });
    this.load.image('help', 'assets/help.png');
    this.load.image('menu', 'assets/icons/menu.png');
    this.load.image('fullscreen-button', 'assets/icons/fullscreen-button.png');
    this.load.image('planet1', 'assets/planet-white.png');
    this.load.image('planet2', 'assets/planet-purple.png');
    this.load.image('projectile', 'assets/projectile.png');
    this.load.image('starfield', 'assets/starfield.png');
    this.load.image('title-screen-background', 'assets/title-screen.png');
    this.load.image('warp-core', 'assets/warp-core.png');
    this.load.audio('background-music', 'assets/audio/background-music.mp3');
    this.load.audio('crash', 'assets/audio/crash.mp3');
    this.load.audio('launch', 'assets/audio/launch.wav');
    this.load.audio('low-bump', 'assets/audio/low-bump.wav');
    this.load.audio('plop', 'assets/audio/plop.wav');
    this.load.audio('warp', 'assets/audio/warp.wav');
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('titleScene');
    });
  }
}
