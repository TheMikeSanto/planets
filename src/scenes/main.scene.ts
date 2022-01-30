import * as Phaser from 'phaser';

import { DebrisManager } from '../debris';
import { SETTINGS } from '../settings.config';
import {
  PlanetSprite,
  PlayerSprite,
} from '../sprites';
import { UiScene } from './ui.scene';

export class MainScene extends Phaser.Scene {
  private backgroundMusic: Phaser.Sound.BaseSound;
  private debrisManager: DebrisManager;
  private crashed = false;
  private distanceScore: number = 0;
  private player: PlayerSprite;
  private starField: Phaser.GameObjects.TileSprite;
  private cloudLayer: Phaser.GameObjects.TileSprite;
  private planets: Phaser.GameObjects.Group;
  private trajectory: Phaser.Curves.Path;
  private graphics: Phaser.GameObjects.Graphics;
  private ui: UiScene;

  constructor (uiScene: UiScene) {
    super('mainScene');
    this.ui = uiScene;
  }

  public create(): void {
    this.scene.launch('uiScene');
    this.crashed = false;
    this.cameras.main.fadeIn(2000);
    const { height, width } = this.scale;
    this.cameras.main.centerOn(width * 0.5, height * 0.5);
    this.starField = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 600, 'starfield');
    this.cloudLayer = this.add.tileSprite(width * 0.5, height * 0.5, 1200, 600, 'clouds');
    this.planets = this.add.group([
      new PlanetSprite(this, -4100, SETTINGS.colors.planets.top, 25),
      new PlanetSprite(this, height + 4075, SETTINGS.colors.planets.bottom, 50),
    ]);
    this.player = new PlayerSprite(this, 200, height / 2 - 10);
    const collider = this.physics.add.collider(this.player, this.planets, (player, planet) => {
      collider.destroy();
      this.doGameOver();
    });
    this.physics.world.bounds.height = height - 80;
    this.graphics = this.add.graphics();
    this.distanceScore = 0;
    this.trajectory = new Phaser.Curves.Path(this.player.position.x, this.player.position.y);
    this.ui.events.on('menuButtonClicked', () => this.scene.pause());
    this.debrisManager = new DebrisManager(this, this.player, this.planets);
    this.debrisManager.start();
    this.backgroundMusic = this.sound.add('background-music', { volume: 0.5 })
    this.backgroundMusic.play();
  }

  public update(): void {
    if (this.crashed) return;
    const scrollFactor = 1;
    this.distanceScore += scrollFactor;
    this.ui.updateScore(this.distanceScore);
    this.starField.tilePositionX += scrollFactor / 5;
    this.cloudLayer.tilePositionX += scrollFactor / 4;
    this.planets.getChildren().forEach((planet, index) => {
      index
        ? (<Phaser.GameObjects.Sprite> planet).rotation -= scrollFactor / 20000
        : (<Phaser.GameObjects.Sprite> planet).rotation += scrollFactor / 20000
    });
    this.drawTrajectory();
    this.player.update();
  }

  /**
   * Shows the game over sequence.
   */
  private doGameOver(): void {
    this.crashed = true;
    this.player.showCrash();
    if (!SETTINGS.disableFailure) {
      this.scene.sendToBack('uiScene');
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
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xffffff, 0.75);
    // Figure out gravity, calculate endpoint and decay curve here
    this.trajectory.lineTo(1200, this.player.position.y);
    this.trajectory.draw(this.graphics);
  }
}
