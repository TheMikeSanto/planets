import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { randomInRange } from '../utils';

enum SpinDirection {
  Clockwise,
  Counterclockwise,
}
export class DebrisSprite extends Phaser.GameObjects.Sprite {
  private scaleFactor = Math.random();
  private shouldRotate = false;
  private readonly spinDirection = _.sample([
    SpinDirection.Clockwise,
    SpinDirection.Counterclockwise
  ]);

  constructor(scene: Phaser.Scene, y: number) {
    super(scene, scene.scale.width + 100, y, 'debris');
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

  public get size(): number {
    return this.scaleFactor;
  }

  public update() {
    if (this.shouldRotate) this.rotate();
    this.setX(this.position.x -(1 - this.scaleFactor));
  }

  private rotate(): void {
    const rotationFactor = (1 - this.scaleFactor);

    const angle = (() => {
      switch (this.spinDirection) {
        case SpinDirection.Clockwise: 
          return this.angle < 360
            ? this.angle + rotationFactor
            : 0;
        case SpinDirection.Counterclockwise:
          return this.angle > 0
            ? this.angle - rotationFactor
            : 360;
      }
    })();
    if (this.spinDirection === SpinDirection.Counterclockwise) {
      console.log('new angle', angle, this.angle, rotationFactor);
    }
    this.setAngle(angle);
  }
}
