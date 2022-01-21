import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preloadScene');
  }

  preload() {
    console.log('load');
    this.load.image('player', 'assets/player-placeholder.png');
    this.load.image('planet-purple', 'assets/planet-purple.png');
    this.load.image('planet-green', 'assets/planet-green.png');
    this.load.image('starfield', 'assets/starfield.jpg');
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('mainScene');
    });
  }
}
