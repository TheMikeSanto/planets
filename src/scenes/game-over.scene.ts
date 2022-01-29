import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { PlayerSprite } from '../sprites';

type Scores = {
  distance: number,
  mass: {
    bottom: number,
    top: number,
  },
  total: number
}
export class GameOverScene extends Phaser.Scene {
  private background: Phaser.GameObjects.TileSprite;
  private scores: Scores;

  constructor() {
    super('gameOverScene');
  }

  public create(): void {
    const { height, width } = this.scale;
    const midpointX = width * 0.5;
    const midpointY = height * 0.5;
    this.background = this.add.tileSprite(midpointX, midpointY, 1200, 600,
      'background-game-over');
    this.drawScoreboard();
    const launchSound = this.sound.add('launch');
    this.input.on('pointerdown', () => {
      launchSound.play();
      this.scene.start('mainScene');
    });
  }

  public init(data: { distance: number, player: PlayerSprite }): void {
    this.scores = this.calculateScores(data.distance, data.player);
  }

  public update(): void {
    this.background.tilePositionX += 0.25;
  }

  /**
   * Calculates and compiles an object containing various game scores.
   *
   * @param distance distance player has traveled
   * @param player player object
   * @returns object containing various scores
   */
  private calculateScores(distance: number, player: PlayerSprite): Scores {
    const debris = player.getDebris();
    const bottomMass = Math.floor(_.chain(debris.bottom)
      .map(d => d.mass)
      .sum()
      .value() * 1000);
    const topMass = Math.floor(_.chain(debris.top)
      .map(d => d.mass)
      .sum()
      .value() * 1000);
    const total = distance + bottomMass + topMass;
    return {
      distance,
      mass: {
        top: topMass,
        bottom: bottomMass,
      },
      total,
    };
  }

  /**
   * Draws a scoreboard.
   */
  private drawScoreboard(): void {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.add.text(screenCenterX, 100, 'GAME OVER', { fontSize: '72px', fontFamily: 'ROGFonts '})
    .setOrigin(0.5);
    this.add.text(screenCenterX, 200, [
      `Distance: ${this.scores.distance} km`,
      `Mass (bottom): ${this.scores.mass.bottom} tons`,
      `Mass (top): ${this.scores.mass.top} tons`
    ], {
      fontSize: '32px',
      fontFamily: 'Arial',
      align: 'left',
    }).setOrigin(0.5);
    this.add.text(screenCenterX, 300, `TOTAL: ${this.scores.total}`, {
      fontSize: '48px',
      fontFamily: 'ROGFonts, Arial'
    }).setOrigin(0.5);
    this.add.text(screenCenterX, this.scale.height - 40, 'Press any button to continue', {
      fontSize: '16px',
      fontFamily: 'ROGFonts, Arial',
    }).setOrigin(0.5);
  }
}
