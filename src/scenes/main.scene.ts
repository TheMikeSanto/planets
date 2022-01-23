import * as Phaser from 'phaser';

import { DebrisManager } from '../debris';
import { SETTINGS } from '../settings.config';
import {
  PlanetTileSprite,
  PlayerSprite,
} from '../sprites';

export class MainScene extends Phaser.Scene {
  private debrisManager: DebrisManager;
  private player: PlayerSprite;
  private starField: Phaser.GameObjects.TileSprite;
  private cloudLayer: Phaser.GameObjects.TileSprite;
  private planets: PlanetTileSprite[];
  private trajectory: Phaser.Curves.Path;
  private graphics: Phaser.GameObjects.Graphics;


  constructor () {
    super('mainScene');
  }
  
  public create(): void {
    const { height, width } = this.scale;
    this.starField = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'starfield');
    this.cloudLayer = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'clouds');
    this.planets = [
      new PlanetTileSprite(this, 20, 'planet1', SETTINGS.planetColors.top),
      new PlanetTileSprite(this, height - 20, 'planet1', SETTINGS.planetColors.bottom),
    ];
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
    this.planets.forEach(body => {
      this.physics.add.collider(this.player, body, (player, body) => {
        if (!SETTINGS.disableFailure) this.scene.start('gameOverScene');
      });
    });
    this.physics.world.bounds.height = height - 80;
    this.graphics = this.add.graphics();
    this.trajectory = new Phaser.Curves.Path(this.player.position.x, this.player.position.y);
    this.debrisManager = new DebrisManager(this, this.player);
    this.debrisManager.start();
  }
  
  public update(time, delta): void {
    const scrollFactor = 1;
    this.starField.tilePositionX += scrollFactor / 5;
    this.cloudLayer.tilePositionX += scrollFactor / 4;
    this.debrisManager.update();
    this.planets.forEach(planet => planet.tilePositionX += scrollFactor);
    this.drawTrajectory();
    this.player.update();
    this.updatePlayerAim(delta);
    if (this.input.mousePointer.isDown) {
      this.player.fireGravityCannon(this.input.x, this.input.y);
    } else {
      this.player.stopGravityCannon();
    }
    
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

  /**
   * Determines if the given key is currently pressed.
   *
   * @param key
   * @returns `true` if key is pressed, `false` otherwise
   */
  private isPressed(key: string): boolean {
    return this.input.keyboard.addKey(key).isDown;
  }

  /**
   * Rotates the player to face the cursor
   * @param delta time in ms from previous frame (from scene `update` function)
   */
  private updatePlayerAim(delta): void {
    if (this.input.x !== 0 && this.input.y !== 0) {
      const cursorAngle = this.getCursorAngle();
      this.player.setPlayerRotation(cursorAngle - Math.PI/2, delta);
    }
    // this.player.setPlayerRotation(this.pointerTargetAngle - Math.PI/2);
  }

  /**
   * Determine the angle between the player and mouse cursor
   * @returns the angle between the player and the mouse cursor
   */
  private getCursorAngle(): number {
    return Phaser.Math.Angle.Between(this.player.position.x, this.player.position.y, this.input.x, this.input.y);
  }

}
