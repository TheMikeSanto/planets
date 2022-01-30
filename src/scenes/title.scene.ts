import * as Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  private clickToStartText: Phaser.GameObjects.Text;
  private launchSound: Phaser.Sound.BaseSound;

  constructor() {
    super('titleScene');
  }

  public create(): void {
    this.cameras.main.fadeIn(2000);
    const { height, width } = this.scale;
    this.launchSound = this.sound.add('launch');
    this.add.image(width / 2, height / 2, 'title-screen-background');
    const fontStyle = {
      stroke: '#000000',
      strokeThickness: 4,
    };
    const clickToStart = this.add.text(420, 300, 'START', { font: '72px ROGFonts', ...fontStyle })
      .setAlpha(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame());
    this.tweens.add({
      targets: clickToStart,
      alpha: { value: 1, duration: 1500, ease: 'Power1' },
      yoyo: true,
      loop: -1,
    });

    const showHelp = this.add.text(420, 382, 'help', { font: '48px ROGFonts', ...fontStyle })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHelp())
    const showCredits = this.add.text(420, 440, 'credits', { font: '48px ROGFonts', ...fontStyle })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showCredits());
  }

  private startGame(): void {
    this.launchSound.play();
    this.scene.start('mainScene');
  }

  private showCredits(): void {
    console.log('show credits');
    this.scene.launch('creditsScene');
  }

  private showHelp(): void {
    console.log('show help');
    this.scene.launch('helpScene');
  }
}
