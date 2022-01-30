import * as Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  private clickToStartText: Phaser.GameObjects.Text;

  constructor() {
    super('titleScene');
  }

  public create(): void {
    this.cameras.main.fadeIn(2000);
    const { height, width } = this.scale;
    const launchSound = this.sound.add('launch');

    this.add.image(width / 2, height / 2, 'title-screen-background')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        launchSound.play();
        this.scene.start('mainScene');
      });
    this.clickToStartText = this.add.text(420, 400, 'click to start', {
      fontFamily: 'ROGFonts',
      fontSize: '24px',
    }).setAlpha(0);
    this.tweens.add({
      targets: this.clickToStartText,
      alpha: { value: 1, duration: 1500, ease: 'Power1' },
      yoyo: true,
      loop: -1,
    });
  }
}
