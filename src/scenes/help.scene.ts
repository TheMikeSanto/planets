import * as Phaser from 'phaser';

export class HelpScene extends Phaser.Scene {

  constructor() {
    super('helpScene');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.scene.bringToTop();
    this.input.on('pointerover', () => this.input.stopPropagation());
    this.input.on('pointerdown', () => this.scene.stop(this));
    this.input.keyboard.on('keydown', () => this.scene.stop(this));
    this.add.image(width / 2, height / 2, 'help')
      .setScale(0.8);
  }
}
