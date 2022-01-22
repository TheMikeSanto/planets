import * as Phaser from 'phaser';

export class DebrisSprite extends Phaser.GameObjects.Sprite {
  private scaleFactor = Math.random();

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

  public update() {
    this.setX(this.position.x -(1 - this.scaleFactor));
  }
}
