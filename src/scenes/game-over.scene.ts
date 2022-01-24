import * as Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private background: Phaser.GameObjects.TileSprite;
  private text;

  constructor() {
    super('gameOverScene');
  }

  public create(): void {
    const { height, width } = this.scale;
    const midpointX = width * 0.5;
    const midpointY = height * 0.5;
    this.background = this.add.tileSprite(midpointX, midpointY, 1200, 600,
      'background-game-over');
    this.text = this.add.text(midpointX - 25, midpointY, 'GAME OVER');
    this.text.setStyle({
      font: 'Arial',
      fontSize: '128px',
    });
    const launchSound = this.sound.add('launch');
    this.time.addEvent({
      callback: () => {
        launchSound.play();
        this.scene.start('mainScene');
      },
      delay: 3000,
    });
  }

  public update(): void {
    this.background.tilePositionX += 0.25;
  }
}
