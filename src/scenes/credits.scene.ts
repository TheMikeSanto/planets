import * as Phaser from 'phaser';

import { SETTINGS } from '../settings.config';

const CONFIG = {
  buttonColor: SETTINGS.colors.planets.top,
  buttonHighlightColor: 0x7d7d7d,
  buttonHeight: 40,
  buttonWidth: 80,
  menuHeight: 500,
  menuWidth: 500,
  padding: 10,
} as const;
export class CreditsScene extends Phaser.Scene {

  constructor() {
    super('creditsScene');
  }

  public create(): void {
    const { height, width } = this.scale;
    this.scene.bringToTop();
    this.input.on('pointerover', () => this.input.stopPropagation());
    this.input.on('pointerdown', () => this.scene.stop(this));
    this.input.keyboard.on('keydown', () => this.scene.stop(this));
    this.showCredits(width / 2, height / 2);
  }

  /**
 * Creates a menu box.
 *
 * @param x x coordinate for menu placement
 * @param y y coordinate for menu placement
 * @returns menu box rectangle
 */
  private showCredits(x: number, y: number): Phaser.GameObjects.Rectangle {
    const menuBox = this.add.rectangle(x , y, CONFIG.menuWidth, CONFIG.menuHeight,
      SETTINGS.colors.planets.bottom);
    menuBox.setStrokeStyle(2, SETTINGS.colors.planets.top);
    const menuTopCenter = menuBox.getTopCenter();
    const fontStyle = {
      stroke: '#000000',
      strokeThickness: 4,
    };
    const title = this.add.text(menuTopCenter.x, menuTopCenter.y + CONFIG.padding, 'Credits',
      { font: '48px ROGFonts', ...fontStyle })
      .setOrigin(0.5, 0);
    const subtitle = this.add.text(menuTopCenter.x, title.getBottomCenter().y + CONFIG.padding,
      'Created by', { font: '24px ROGFonts', ...fontStyle })
      .setOrigin(0.5, 0)
    const credits = this.add.text(menuTopCenter.x, subtitle.getBottomCenter().y + CONFIG.padding,
      [
        'Cale Hansen',
        'Ryan McDermott',
        'Mike Santo',
        'Chris Seidholz',
      ], { font: '16px ROGFonts', ...fontStyle }).setOrigin(0.5, 0);
    return menuBox;
  }
}
