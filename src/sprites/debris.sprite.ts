import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { randomInRange } from '../utils';

enum SpinDirection {
  Clockwise,
  Counterclockwise,
}

const CONFIG = {
  /** Minimum scale factor */
  minScaleFactor: 0.25,
} as const;

/**
 * Class representing a debris object.
 *
 * @note sprite asset base size is 260x260
 */
export class DebrisSprite extends Phaser.GameObjects.Sprite {
  private static readonly ASSET_KEYS: string[] = [
    'debris-blue',
    'debris-white',
  ];
  private scaleFactor = this.determineScaleFactor();
  private shouldRotate = _.sample([true, false]);
  private readonly spinDirection = _.sample([
    SpinDirection.Clockwise,
    SpinDirection.Counterclockwise
  ]);

  constructor(scene: Phaser.Scene, y: number) {
    super(scene, scene.scale.width + 100, y, _.sample(DebrisSprite.ASSET_KEYS));
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setScale(this.scaleFactor);
  }

  /**
   * Provides the sprite's center point on x and y
   *
   * @return object containing the sprite's center point on x and y axes
   */
  public get position(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * Returns the debris' [[scaleFactor]]
   */
  public get size(): number {
    return this.scaleFactor;
  }

  public update() {
    if (this.shouldRotate) this.rotate();
    this.setX(this.position.x -(1 - this.scaleFactor));
  }

  /**
   * Generates a pseudorandom number to be used to determine the debris' scale.
   *
   * @returns generated scale factor
   */
  private determineScaleFactor(): number {
    const scaleFactor = Math.random() / randomInRange(2, 5);
    return Math.min(scaleFactor, CONFIG.minScaleFactor);
  }

  /**
   * Rotates the sprite clockwise or counterclockwise according to its [[SpinDirection]]
   */
  private rotate(): void {
    const rotationFactor = (1 - this.scaleFactor) / 500;

    switch (this.spinDirection) {
      case SpinDirection.Clockwise:
        this.rotation += rotationFactor;
        break;
      case SpinDirection.Counterclockwise:
        this.rotation -= rotationFactor;
        break;
    }
  }
}
