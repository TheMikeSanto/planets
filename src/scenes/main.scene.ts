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
    // should probably create a planet sprite class
    this.planets = [
      this.add.tileSprite(600, 20, 1200, 40, 'planet-green'),
      this.add.tileSprite(600, height - 20, 1200, 40, 'planet-purple'),
    ];
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
    this.physics.world.bounds.height = height - 80;
    this.planets.forEach(planet => {
      this.physics.add.existing(planet);
      planet.body['immovable'] = true;
      this.physics.add.collider(this.player, planet, (player, planet) => {
        console.log('collision', planet);
      });
    });
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
    if (this.isPressed('w')) {
      this.player.body.velocity.y -= 1;
      console.log(this.player.body.velocity);
    }
    if (this.isPressed('s')) {
      this.player.body.velocity.y += 1;
      console.log(this.player.body.velocity);
    }
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xffffff, 0.75);
    // Figure out gravity, calculate endpoint and decay curve here
    this.trajectory.lineTo(1200, this.player.position.y);
    this.trajectory.draw(this.graphics);
  }

  private isPressed(key: string): boolean {
    return this.input.keyboard.addKey(key).isDown;
  }
}
