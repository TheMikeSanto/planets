import * as Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('titleScene');
  }

  public create(): void {
    this.cameras.main.fadeIn(2000);
    const { height, width } = this.scale;
    const launchSound = this.sound.add('launch');

    this.add.image(width / 2, height / 2, 'title-screen-background')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        launchSound.play();
        this.scene.start('mainScene');
      });
    this.add.text(420, 400, 'click to start', {
      fontFamily: 'Arial',
      fontSize: '24px',
    });
  }
}
