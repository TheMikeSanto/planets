import * as Phaser from 'phaser';

type CounterWithLabel = {
  counter: Phaser.GameObjects.Text,
  label: Phaser.GameObjects.Text,
}

export class UiScene extends Phaser.Scene {
  private menuButton: Phaser.GameObjects.Sprite;
  private scoreCounter: CounterWithLabel;

  constructor() {
    super('uiScene');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.scene.bringToTop(this);
    this.menuButton = this.initMenuButton();
    this.scoreCounter = this.initScoreCounter(height - 22);
  }

  public updateScore(score: number): void {
    this.scoreCounter?.counter.setText(`${score} km`);
  }

  /**
   * Creates a menu button and wires up event handlers.
   */
   private initMenuButton(): Phaser.GameObjects.Sprite {
    const { height, width } = this.scale;
    const menuButton = this.add.sprite(width - 30, height - 20, 'menu')
      .setScale(0.5)
      .setTintFill(1)
      .setTint(0xffffff)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => menuButton.setTint(0x7d7d7d))
      .on('pointerout', () => menuButton.setTint(0xffffff))
      .on('pointerdown', () => {
        this.events.emit('menuButtonClicked');
        this.scene.sendToBack(this);
        this.scene.launch('pauseScene')
      });
    return menuButton;
  }

  private initScoreCounter(y: number): CounterWithLabel {
    const padding = 10;
    const style = {
      fontFamily: 'ROGFonts',
      fontSize: '24px',
      stroke: '#000000',
      strokeThickness: 4,
    };
    const label = this.add.text(padding, y, 'Distance: ', style)
      .setOrigin(0, 0.5);
    const counter = this.add.text(label.width + padding, y, `0`, style)
      .setOrigin(0, 0.5);
    return { label, counter };
  }
}
