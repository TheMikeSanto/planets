import * as Phaser from 'phaser';

import { DebrisManager } from '../debris';
import { SETTINGS } from '../settings.config';
import {
  PlanetTileSprite,
  PlayerSprite,
} from '../sprites';

export class MainScene extends Phaser.Scene {
  private backgroundMusic: Phaser.Sound.BaseSound;
  private debrisManager: DebrisManager;
  private distanceScore: number = 0;
  private player: PlayerSprite;
  private scoreCounter: Phaser.GameObjects.Text;
  private starField: Phaser.GameObjects.TileSprite;
  private cloudLayer: Phaser.GameObjects.TileSprite;
  private planets: Phaser.GameObjects.Group;
  private trajectory: Phaser.Curves.Path;
  private graphics: Phaser.GameObjects.Graphics;

  constructor () {
    super('mainScene');
  }

  public create(): void {
    this.cameras.main.fadeIn(2000);
    const { height, width } = this.scale;
    this.cameras.main.centerOn(width * 0.5, height * 0.5);
    this.starField = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'starfield');
    this.cloudLayer = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 520, 'clouds');
    this.planets = this.add.group([
      new PlanetTileSprite(this, 20, 'planet1', SETTINGS.colors.planets.top),
      new PlanetTileSprite(this, height - 20, 'planet1', SETTINGS.colors.planets.bottom),
    ]);
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
    const collider = this.physics.add.collider(this.player, this.planets, (player, planet) => {
      collider.destroy();
      this.doGameOver();
    });
    this.physics.world.bounds.height = height - 80;
    this.graphics = this.add.graphics();
    this.distanceScore = 0;
    this.scoreCounter = this.add.text(0, height - 20, `${this.distanceScore}`);
    this.trajectory = new Phaser.Curves.Path(this.player.position.x, this.player.position.y);
    this.debrisManager = new DebrisManager(this, this.player, this.planets);
    this.debrisManager.start();
    this.backgroundMusic = this.sound.add('background-music', { volume: 0.5 })
    this.backgroundMusic.play();
  }

  public update(time, delta): void {
    const scrollFactor = 1;
    this.distanceScore += scrollFactor;
    this.scoreCounter.setText(`Distance: ${this.distanceScore}km`);
    this.starField.tilePositionX += scrollFactor / 5;
    this.cloudLayer.tilePositionX += scrollFactor / 4;
    this.planets.getChildren().forEach(planet => {
      (<Phaser.GameObjects.TileSprite> planet).tilePositionX += scrollFactor;
    });
    this.drawTrajectory();
    this.player.update();
    this.updatePlayerAim(delta);
  }

  /**
   * Shows the game over sequence.
   */
  private doGameOver(): void {
    this.player.showCrash();
    if (!SETTINGS.disableFailure) {
      this.cameras.main.pan(this.player.position.x, this.player.position.y, 2000);
      this.cameras.main.zoomTo(4, 3000);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.time.delayedCall(1000,
          () => this.scene.start('gameOverScene', { distance: this.distanceScore, player: this.player }));
      });
      this.cameras.main.fadeOut(2000, 0, 0, 0);
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
