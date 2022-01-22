import * as _ from 'lodash';
import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisSource
} from '../debris';
import {
  randomEnum,
  randomInRange,
} from '../utils';

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
  /**The amount the sprite should be scaled relative to the maximum sprite size */
  private scaleFactor = this.determineScaleFactor();
  /** Determines whether object should rotate */
  private readonly shouldRotate = _.sample([true, false]);
  /** Determines which planet the debris belongs to */
  private readonly sourcePlanet = randomEnum(DebrisSource);
  /** Object's spin direction */
  private readonly spinDirection = this.shouldRotate
    ? randomEnum(SpinDirection)
    : undefined;

  /**
   * Constructor.
   *
   * @param scene scene the debris will be added to
   * @param y vertical position of debris on creation
   */
  constructor(scene: Phaser.Scene, y: number) {
    super(scene, scene.scale.width + 100, y, 'debris-white');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setScale(this.scaleFactor);
    if (this.sourcePlanet === DebrisSource.Bottom) this.setTint(0x2a24ee);
  }

  /**
   * Generates a debris collection object.
   *
   * @return debris collection data
   */
  public get collectionData(): CollectedDebris {
    return {
      sourcePlanet: this.sourcePlanet,
      mass: this.scaleFactor,
    }
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
