import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preloadScene');
  }

  preload() {
    this.load.image('background-game-over', 'assets/game-over-bg.png');
    this.load.image('barrier', 'assets/barrier.png');
    this.load.image('debris', 'assets/debris.png');
    this.load.image('debris-blue', 'assets/debris-blue.png');
    this.load.image('debris-white', 'assets/debris-white.png');
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
