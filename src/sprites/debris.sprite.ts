import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { SETTINGS } from '../settings.config';

import {
  ASSET_KEYS,
  CollectedDebris,
  DebrisSource,
  DebrisType,
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
  minScaleFactor: 0.1,
  /** Common velocity multiplier */
  velocityMultiplier: 75
} as const;

/**
 * Class representing a debris object.
 *
 * @note sprite asset base size is 260x260
 */
export class DebrisSprite extends Phaser.GameObjects.Sprite {
  /**The amount the sprite should be scaled relative to the maximum sprite size */
  private scaleFactor: number;
  /** Determines which planet the debris belongs to */
  private debrisSource: DebrisSource;
  /** The type of debris */
  private debrisType: DebrisType;
  /** Determines whether object should rotate */
  private readonly shouldRotate = _.sample([true, false]);
  /** Object's spin direction */
  private readonly spinDirection = this.shouldRotate
    ? randomEnum(SpinDirection)
    : undefined;

  /**
   * Constructor.
   *
   * @param scene scene the debris will be added to
   * @param y vertical position of debris on creation
   * @param type optional. type of debris.
   * @param source optional. debris source.
   */
  constructor(scene: Phaser.Scene,y: number, type = DebrisType.Default,
    source = randomEnum(DebrisSource)) {
    super(scene, scene.scale.width + 100 + randomInRange(0, 75), y, _.sample(ASSET_KEYS[type]));
    this.debrisSource = source;
    this.debrisType = type;
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.scaleFactor = this.determineScaleFactor();
    this.setScale(this.scaleFactor);
    this.applyTint();
    this.body.velocity.x = -(1 - this.scaleFactor)*100;
  }

  /**
   * Generates a debris collection object.
   *
   * @return debris collection data
   */
  public get collectionData(): CollectedDebris {
    return {
      source: this.debrisSource,
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

  public update(): void {
    if (this.shouldRotate) this.rotate();
   }

  /**
   * Applies the appropriate tint according to the debris' source planet.
   */
  private applyTint(): void {
    const sourceColorMap = {
      [DebrisSource.Bottom]: SETTINGS.colors.planets.bottom,
      [DebrisSource.Top]: SETTINGS.colors.planets.top,
    };
    this.setTint(sourceColorMap[this.debrisSource]);
  }

  /**
   * Generates a pseudorandom number to be used to determine the debris' scale.
   *
   * @returns generated scale factor
   */
  private determineScaleFactor(): number {
    const scaleFactor = Math.random() / randomInRange(2, 5);
    return Math.max(scaleFactor, CONFIG.minScaleFactor);
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
