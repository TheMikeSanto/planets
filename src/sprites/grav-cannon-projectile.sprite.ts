import * as Phaser from 'phaser';

// TODO
// enum ProjectileType {
//   'push',
//   'pull'
// } 

export class GravCannonProjectileSprite extends Phaser.GameObjects.Sprite {
  public age = 0;
  public projType: string // = ProjectileType;

  constructor(scene: Phaser.Scene, x, y, projType) {
    super(scene, x, y, 'grav-cannon-projectile');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setScale(0.7);
    this.setVisible(false);
    this.projType = projType;
  }

  /**
   * Provides the sprite's center point on x and y
   *
   * @return object containing the sprite's center point on x and y axes
   */
  public get position(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

}