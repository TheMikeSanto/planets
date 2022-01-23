import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisCollection,
  DebrisManager
} from '../debris';
import { GravCannonProjectileSprite } from './';

const DEFAULT_FIRE_COOLDOWN = 1000; //TODO: abstract into a CONSTANTS file?
const FIRING_DISTANCE = 5; // how many update ticks a projectile will live before being destroyed
const MAX_NUM_PROJECTILES = 10; // maxmimum # of projectiles to draw (for performance)
const ROTATION_SPEED = 1 * Math.PI; // radians/second

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private readonly movementRate = 2;
  private readonly movementAngle = 5;
  private readonly debris: DebrisCollection = new DebrisCollection();
  public gravProjectiles: [GravCannonProjectileSprite?] = [];
  private inFiringCooldown = false;
  private isFiring = false;
  private currentProjType = 'pull';

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body['pushable'] = false; // so player body doesn't get pushed back by projectile
    this.setScale(0.3);
    this.setRotation(3*Math.PI/2);

    // mouse control
    this.scene.input.on('pointerdown', pointer => {
      if (pointer.rightButtonDown()) this.fireGravityCannon('push');
      if (pointer.leftButtonDown()) this.fireGravityCannon('pull');
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
  public fireGravityCannon(projType: string): void {
    const tooManyProjectiles = this.gravProjectiles.length > MAX_NUM_PROJECTILES;
    if (this.inFiringCooldown || tooManyProjectiles) return
    // this.inFiringCooldown = true;
    this.currentProjType = projType;
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
  
  private incrementProjectileStatus(gravProjectiles): [GravCannonProjectileSprite] {
    return gravProjectiles.reduce((newProjArray, proj) => {
      // add 1 age to each projectile
      proj.age += 1;

      // if age > threshold, destroy the projectile
      if (proj.age >= FIRING_DISTANCE) {
        proj.destroy();
      } else {
        newProjArray.push(proj);
      }
      return newProjArray;
    }, [])
  }

  public update(): void {
    this.body.velocity.y = this.debris.getRelativeMass() * 100;
    // console.log('Velocity: ', this.body.velocity.y)

    // Shoot the gun
    if (this.isFiring) {
      const newProjectile = new GravCannonProjectileSprite(this.scene, this.position.x, this.position.y, this.currentProjType);
      this.scene.physics.moveTo(newProjectile, this.scene.input.x, this.scene.input.y, 1000);
      this.gravProjectiles.push(newProjectile);
      console.log(`firing gravity gun of type: ${this.currentProjType}` );
    }
    if (this.gravProjectiles.length) this.gravProjectiles = this.incrementProjectileStatus(this.gravProjectiles);

  }
}
