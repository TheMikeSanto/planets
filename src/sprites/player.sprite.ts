import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisCollection,
  DebrisManager
} from '../debris';
import { DebrisSprite } from './debris.sprite';
import { GravCannonProjectileSprite } from './';

const DEFAULT_FIRE_COOLDOWN = 1000; //TODO: abstract into a CONSTANTS file?
const FIRING_DISTANCE = 100;
const FIRING_RADIUS = 25;
const ROTATION_SPEED = 1 * Math.PI; // radians/second

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private readonly movementRate = 2;
  private readonly movementAngle = 5;
  private readonly debris: DebrisCollection = new DebrisCollection();
  public gravGunField: Phaser.GameObjects.Triangle;
  private inFiringCooldown = false;
  private isFiring = false;

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body['pushable'] = false; // so player body doesn't get pushed back by projectile
    this.setScale(0.35);
    this.setRotation(3*Math.PI/2);

    // draw triangle
    this.gravGunField = 
      this.scene.add.triangle(this.position.x, this.position.y, 
        0, 0, 
        0 + FIRING_DISTANCE, 0 + FIRING_RADIUS, 
        0 + FIRING_DISTANCE, 0 - FIRING_RADIUS, 
        0xfc010e, 0);
    this.scene.physics.add.existing(this.gravGunField);
    this.gravGunField.setOrigin(0, 0);
    debugger;
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
    this.gravGunField.setRotation(angle);
    // this.gravGunField.rotation = Phaser.Math.Angle.RotateTo(
    //   this.gravGunField.rotation,
    //   angle + Math.PI/2,
    //   ROTATION_SPEED * 0.001 * delta
    // );
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
  * @param cursorX The x coordinate of the cursor's current position
  * @param cursorY The y coordinate of the cursor's current position
  */
  public fireGravityCannon(cursorX: number, cursorY: number): void {
    if (this.inFiringCooldown) return
    this.inFiringCooldown = true;
    this.isFiring = true;

    this.gravGunField.fillAlpha = 1; 

    // const debrisCollisionGroup = DebrisManager.debrisCollisionGroup();
    // const debrisCollider = this.scene.physics.add.collider(debrisCollisionGroup, this.gravGunField, 
    //   (debris, gravGunField) => {
    //     console.log(`DEBRIS/GRAV COLLISON BOO YAH ${}`)
    // })

    // return projectile to player after a certain distance travelled
    // TODO: find more elegant way to track distance projectile traveled
    // setTimeout(() => {
    //   const collider = this.scene.physics.add.collider(triangleProj, this, (projectile, player) => {
    //     console.log('destroying projectile on player impact');
    //     projectile.destroy();
    //     collider.destroy();
    //   });
    //   this.scene.physics.moveTo(triangleProj, this.position.x, this.position.y);
    //   this.inFiringCooldown = false;
    // }, );
  }

  public stopGravityCannon(): void {
    this.isFiring = true;
    this.inFiringCooldown = false;
    this.gravGunField.fillAlpha = 0;
  }

  public update(): void {
    this.body.velocity.y = this.debris.getRelativeMass() * 100;
    // console.log('Velocity: ', this.body.velocity.y);
    // link gravGunField position to sprite
    this.gravGunField.setPosition(this.position.x, this.position.y);
  }
}
