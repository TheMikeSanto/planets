import * as Phaser from 'phaser';

import { PlayerSprite } from '../sprites';

export class MainScene extends Phaser.Scene {
  private player: PlayerSprite;
  private starField: Phaser.GameObjects.TileSprite;
  private planetPurple: Phaser.GameObjects.TileSprite;
  private planetGreen: Phaser.GameObjects.TileSprite;

  constructor () {
    super('mainScene');
  }
  
  create () {
    const { height, width } = this.scale;
    this.starField = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'starfield');
    this.planetGreen = this.add.tileSprite(600, 20, 1200, 40, 'planet-green');
    this.planetPurple = this.add.tileSprite(600, height - 20, 1200, 40, 'planet-purple');
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
  }

  public update(): void {
    this.starField.tilePositionX += 0.1;
    this.planetPurple.tilePositionX += 1;
    this.planetGreen.tilePositionX += 1;
  }
}
