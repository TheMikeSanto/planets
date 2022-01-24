import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisCollection,
} from '../debris';
import {
  ActionType,
  ProjectileSprite,
} from './grav-cannon';

const ROTATION_SPEED = 1 * Math.PI; // radians/second

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private readonly debris: DebrisCollection = new DebrisCollection();
  private gravCannonAction: ActionType = ActionType.Pull;
  private inFiringCooldown = false;
  private isFiring = false;
  private projectiles: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body['pushable'] = false; 
    this.setScale(0.3);
    this.setRotation(3*Math.PI/2);
    this.projectiles = scene.add.group([], { runChildUpdate: true });
    this.scene.input.on('pointerdown', pointer => {
      if (pointer.rightButtonDown()) this.fireGravityCannon(ActionType.Push);
      if (pointer.leftButtonDown()) this.fireGravityCannon(ActionType.Pull);
    })
    this.scene.input.on('pointerup', pointer => this.stopGravityCannon());
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
   * Provides the projectile group.
   *
   * @return projectile group
   */
  public get projectileGroup(): Phaser.GameObjects.Group {
    return this.projectiles;
  }

  /**
   * Adds the given debris to the player's debris collection.
   *
   * @param debris debris to be collected
   */
  public collectDebris(debris: CollectedDebris): void {
    this.debris.add(debris);
  }

  /** Fires the Gravity Cannon (if it is not in cooldown)
  * @param projType Type of projectile: 'push' or 'pull
  */
  public fireGravityCannon(actionType: ActionType): void {
    if (this.inFiringCooldown) return;
    this.gravCannonAction = actionType;
    this.isFiring = true;
  }

  /**
   * Sets the rotation of the Player + Grav Gun Field together
   * @param angle angle in radians
   * @param delta time in ms from previous frame (from scene `update` function)
   */
  public setPlayerRotation(angle: number, delta: number) {
    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      angle,
      ROTATION_SPEED * 0.001 * delta
    );
  }

  public stopGravityCannon(): void {
    this.isFiring = false;
    this.inFiringCooldown = false;
  }

  public update(): void {
    this.body.velocity.y = this.debris.getRelativeMass() * 100;

    if (this.isFiring) {
      const projectile = new ProjectileSprite(this.scene, {
        action: this.gravCannonAction,
        start: {
          x: this.position.x,
          y: this.position.y,
        },
        end: {
          x: this.scene.input.x,
          y: this.scene.input.y,
        }
      });
      this.projectileGroup.add(projectile);
    }
  }
}
