import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisCollection,
} from '../debris';
import {DebrisSprite } from './debris.sprite';

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private readonly movementRate = 2;
  private readonly movementAngle = 5;
  private readonly debris: DebrisCollection = new DebrisCollection();

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setScale(0.5);
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
   * Adds the given debris to the player's debris collection.
   *
   * @param debris debris to be collected
   */
  public collectDebris(debris: CollectedDebris): void {
    this.debris.add(debris);
  }

  public update(movement): void {
    if (movement.up) {
      this.y -= this.movementRate;
    }
    if (movement.down) {
      this.y += this.movementRate;
    }
    if (movement.left) {
      this.flipX = true;
      this.angle = this.movementAngle;
      this.x -= this.movementRate;
    }
    if (movement.right) {
      this.flipX = false;
      this.angle = -this.movementAngle;
      this.x += this.movementRate;
    }
    if (!movement.right && !movement.left) {
      this.angle = 0;
    }
  }
}