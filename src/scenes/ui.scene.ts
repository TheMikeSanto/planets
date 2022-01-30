import * as _ from 'lodash';
import * as Phaser from 'phaser';

type CounterWithLabel = {
  counter: Phaser.GameObjects.Text,
  label: Phaser.GameObjects.Text,
}

const CONFIG = {
  padding: 10,
} as const;
export class UiScene extends Phaser.Scene {
  private menuButton: Phaser.GameObjects.Sprite;
  private scoreCounter: CounterWithLabel;
  private warpCores: Phaser.GameObjects.Sprite[];

  constructor() {
    super('uiScene');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.scene.bringToTop(this);
    this.menuButton = this.initMenuButton();
    this.scoreCounter = this.initScoreCounter(height - 22);
    this.warpCores = this.initWarpCores(this.scoreCounter.counter.getTopCenter().y - 20);
  }

  public updateScore(score: number): void {
    this.scoreCounter?.counter.setText(`${score} km`);
  }

  public updateWarpCoreCount(count: number): void {
    this.warpCores.slice(-(3 -count)).forEach(warpCore => {
      warpCore.setTintFill(1);
      warpCore.setTint(0x7d7d7d);
    })
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
    const style = {
      fontFamily: 'ROGFonts',
      fontSize: '24px',
      stroke: '#000000',
      strokeThickness: 4,
    };
    const label = this.add.text(CONFIG.padding, y, 'Distance: ', style)
      .setOrigin(0, 0.5);
    const counter = this.add.text(label.width + CONFIG.padding, y, `0`, style)
      .setOrigin(0, 0.5);
    return { label, counter };
  }

  private initWarpCores(y: number): Phaser.GameObjects.Sprite[] {
    const createSprite = (x) => {
      const sprite = this.add.sprite(x, y, 'warp-core');
      sprite.setScale(0.2);
      return sprite;
    }
    const first = createSprite(30);
    const second = createSprite(first.getRightCenter().x + CONFIG.padding);
    const third = createSprite(second.getRightCenter().x + CONFIG.padding)
    return [ first, second, third ];
  }
}