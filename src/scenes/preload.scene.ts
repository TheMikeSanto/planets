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
    ASSET_KEYS[DebrisType.Default].forEach(key => {
      this.load.image(key, `assets/debris/${key}.png`);
    });
    ASSET_KEYS[DebrisType.Special].forEach(key => {
      this.load.image(key, `assets/debris/special/${key}.png`);
    });
    this.load.image('background-game-over', 'assets/game-over-bg.png');
    this.load.image('clouds', 'assets/clouds1.png');
    this.load.image('barrier', 'assets/barrier.png');
    this.load.image('player', 'assets/ship_flat1.png');
    this.load.image('planet1', 'assets/planet-white.png');
    this.load.image('planet2', 'assets/planet-purple.png');
    this.load.image('starfield', 'assets/starfield.png');
    this.load.audio('background-music', 'assets/audio/background-music.wav');
    this.load.audio('crash', 'assets/audio/crash.mp3');
    this.load.audio('launch', 'assets/audio/launch.wav');
    this.load.audio('low-bump', 'assets/audio/low-bump.wav');
    this.load.audio('plop', 'assets/audio/plop.wav');
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('mainScene');
    });
  }
}
