import { SETTINGS } from '../settings.config';
import { ActionType } from '@sprites/grav-cannon';
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
  private fullscreenButton: Phaser.GameObjects.Sprite;
  private gravActionToggleButton: Phaser.GameObjects.Arc;
  private scoreCounter: CounterWithLabel;
  private warpCores: Phaser.GameObjects.Sprite[];
  private isTouchEnabled: Boolean;

  constructor() {
    super('uiScene');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.scene.bringToTop(this);
    this.menuButton = this.initMenuButton();
    this.fullscreenButton = this.initFullscreenButton();
    this.scoreCounter = this.initScoreCounter(height - 22);
    this.warpCores = this.initWarpCores(this.scoreCounter.counter.getTopCenter().y - 20);
    this.isTouchEnabled = !this.sys.game.device.os.desktop; // TODO: extract this out somewhere? it's repeated elsewhere once. also might need to be more specific w/ how it's derived
    if (this.isTouchEnabled) this.initTouchControls();
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

  /**
   * Creates a menu button and wires up event handlers.
   */
     private initFullscreenButton(): Phaser.GameObjects.Sprite {
      const { height, width } = this.scale;
      const fullscreenButton = this.add.sprite(width - 20, 40, 'fullscreen-button')
        .setScale(0.7)
        .setTintFill(1)
        .setTint(0xffffff)
        .setAlpha(0.7)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => fullscreenButton.setTint(0x7d7d7d))
        .on('pointerout', () => fullscreenButton.setTint(0xffffff))
        .on('pointerdown', () => {
          this.events.emit('fullscreenButtonClicked');
          if (!this.scale.isFullscreen) {
            this.scale.startFullscreen();
          } else {
            this.scale.stopFullscreen();
          }
        });
      return fullscreenButton;
    }


  private initTouchControls(): void {
    this.gravActionToggleButton = this.initTouchGravActionToggleButton();
  }

  /**
   * Creates a transparent button to toggle Gravity Gun Action.
   */
  private initTouchGravActionToggleButton(): Phaser.GameObjects.Arc {
    const { height, width } = this.scale;
    const gravActionToggleButton = this.add.circle(70, height/2 + 120, 50, SETTINGS.colors.gravBeam.pull[0], 0.2)
      .setScale(1)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        gravActionToggleButton.fillColor = SETTINGS.colors.gravBeam.push[0]
        this.events.emit('setGravActionPushButton');
      })
      .on('pointerup', () => {
        gravActionToggleButton.fillColor = SETTINGS.colors.gravBeam.pull[0]
        this.events.emit('setGravActionPullButton');
      })
    return gravActionToggleButton;
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

    const cores = [ first, second, third ];
    // TODO: Why isn't this firing? also tried putting it in createSprite
    // cores.forEach(core => 
    //   core.on('pointerup', () => {
    //   this.events.emit('usedWarpCoreButton');
    // }));
    return cores;
  }
}
