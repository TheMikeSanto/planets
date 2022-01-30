import * as Phaser from 'phaser';

import { SETTINGS } from '../settings.config';

type ButtonConfig = {
  label: string,
  callback: Function,
};

type ButtonWithText = {
  button: Phaser.GameObjects.Rectangle,
  text: Phaser.GameObjects.Text,
};

const CONFIG = {
  buttonColor: SETTINGS.colors.planets.top,
  buttonHighlightColor: 0x7d7d7d,
  buttonHeight: 40,
  buttonWidth: 80,
  menuHeight: 300,
  menuWidth: 400,
  padding: 10,
} as const;
export class PauseScene extends Phaser.Scene {
  private menuBox: Phaser.GameObjects.Rectangle;

  constructor() {
    super('pauseScene');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.scene.bringToTop(this);
    this.menuBox = this.createMenuBox(width / 2, height / 2);
    this.createButtons([
      {
        label: this.sound.mute ? 'Unmute' : 'Mute',
        callback: menuButton => this.onMute(menuButton),
      },
      {
        label: 'Resume',
        callback: () => this.onResume(),
      },
    ]);
  }

  /**
   * Creates a menu box.
   *
   * @param x x coordinate for menu placement
   * @param y y coordinate for menu placement
   * @returns menu box rectangle
   */
  private createMenuBox(x: number, y: number): Phaser.GameObjects.Rectangle {
    const menuBox = this.add.rectangle(x , y, CONFIG.menuWidth, CONFIG.menuHeight,
      SETTINGS.colors.planets.bottom);
    menuBox.setStrokeStyle(2, SETTINGS.colors.planets.top);
    const menuTopCenter = menuBox.getTopCenter();
    this.add.text(menuTopCenter.x, menuTopCenter.y + CONFIG.padding, 'PAUSED',
      { fontSize: '24px', fontFamily: 'Arial' })
      .setOrigin(0.5, 0);
    return menuBox;
  }

  /**
   * Creates a button with text.
   *
   * @param x x coordinate for button placement
   * @param y y coordinate for button placement
   * @param label label for button
   * @returns object containing button's rectangle and text
   */
  private createButton(x: number, y: number, label: string): ButtonWithText {
    const button = this.add.rectangle(x, y - CONFIG.buttonHeight / 2 - 10,
      CONFIG.buttonWidth, CONFIG.buttonHeight)
      .setStrokeStyle(2, SETTINGS.colors.planets.top)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => button.setStrokeStyle(2, CONFIG.buttonHighlightColor))
      .on('pointerout', () => button.setStrokeStyle(2, CONFIG.buttonColor))
    const buttonCenter = button.getCenter();
    const text = this.add.text(buttonCenter.x, buttonCenter.y, label, {
      fontSize: '12px',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    return { button, text };
  }

  /**
   * Creates a column of buttons with the given configs.
   *
   * @param buttons array of button configs
   */
  private createButtons(buttons: ButtonConfig[]): void {
    const buttonCenterX = this.menuBox.getCenter().x;
    const buttonStartY = this.menuBox.getTopCenter().y + 84 + CONFIG.padding;
    buttons.forEach((button, index) => {
      let y = buttonStartY + (CONFIG.buttonHeight * index)
      if (index > 0) y += CONFIG.padding;
      const menuButton = this.createButton(buttonCenterX, y, button.label);
      menuButton.button.on('pointerdown', () => button.callback(menuButton));
    });
  }

  /**
   * Handles pressing of the mute/unmute button.
   *
   * @param menuButton mute button object
   */
  private onMute(menuButton: ButtonWithText): void {
    this.sound.mute = !this.sound.mute;
    this.sound.mute
      ? menuButton.text.setText('Unmute')
      : menuButton.text.setText('Mute');
  }

  /**
   * Handles pressing of the resume button.
   */
  private onResume(): void {
    this.game.scene.bringToTop('uiScene');
    this.game.scene.resume('mainScene');
    this.game.scene.stop('pauseScene');
  }
}
