import * as Phaser from 'phaser';

import {
  ASSET_KEYS,
  DebrisType,
} from '../debris';
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preloadScene');
  }

  preload() {
    ASSET_KEYS[DebrisType.Default].forEach(key => {
      this.load.image(key, `assets/debris/${key}.png`);
    });
    ASSET_KEYS[DebrisType.Special].forEach(key => {
      this.load.image(key, `assets/debris/special/${key}.png`);
    });
    this.load.image('background-game-over', 'assets/game-over-bg.png');
    this.load.image('barrier', 'assets/barrier.png');
    this.load.image('player', 'assets/player-placeholder.png');
    this.load.image('planet1', 'assets/planet-white.png');
    this.load.image('planet2', 'assets/planet-purple.png');
    this.load.image('starfield', 'assets/starfield.png');
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('mainScene');
    });
  }
}
