import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preloadScene');
  }

  preload() {
    console.log('load');
    this.load.image('player', 'assets/player-placeholder.png');
    this.load.image('stars', 'assets/stars.jpg');
    this.load.on('complete', () => {
      console.log('complete');
      this.scene.start('mainScene');
    });
  }
}
