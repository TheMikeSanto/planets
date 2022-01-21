import * as Phaser from 'phaser';

import { PlayerSprite } from '../sprites';

export class MainScene extends Phaser.Scene {
  private player: PlayerSprite;
  private starField: Phaser.GameObjects.TileSprite;
  private planets: Phaser.GameObjects.TileSprite[];
  private trajectory: Phaser.Curves.Path;
  private graphics: Phaser.GameObjects.Graphics;

  constructor () {
    super('mainScene');
  }
  
  create () {
    const { height, width } = this.scale;
    this.starField = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'starfield');
    this.planets = [
      this.add.tileSprite(600, 20, 1200, 40, 'planet-green'),
      this.add.tileSprite(600, height - 20, 1200, 40, 'planet-purple'),
    ]
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
    this.graphics = this.add.graphics();
    this.trajectory = new Phaser.Curves.Path(this.player.position.x, this.player.position.y);
  }
  
  public update(): void {
    const scrollFactor = 0.75;
    this.starField.tilePositionX += scrollFactor / 4;
    this.planets.forEach(planet => planet.tilePositionX += scrollFactor);
    this.drawTrajectory();
  }

  /**
   * Draws the player's current trajectory on screen
   */
  private drawTrajectory(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xffffff, 0.75);
    // Figure out gravity, calculate endpoint and decay curve here
    this.trajectory.lineTo(1200, this.player.position.y);
    this.trajectory.draw(this.graphics);
  }
}
