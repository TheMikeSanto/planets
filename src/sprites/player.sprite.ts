import * as Phaser from 'phaser';

import {
  CollectedDebris,
  DebrisCollection,
} from '../debris';
import { DebrisSprite } from './debris.sprite';
import { GravCannonProjectileSprite } from './';

const DEFAULT_FIRE_COOLDOWN = 1000; //TODO: abstract into a CONSTANTS file?
const MAX_FIRING_RANGE = 100;

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private readonly movementRate = 2;
  private readonly movementAngle = 5;
  private readonly debris: DebrisCollection = new DebrisCollection();
  private gravGunField: Phaser.GameObjects.Triangle;
  private inFiringCooldown = false;

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body['pushable'] = false; // so player body doesn't get pushed back by projectile
    this.setScale(0.35);
    this.setRotation(3*Math.PI/2);

    // draw triangle
    this.gravGunField = 
      this.scene.add.triangle(0, 0, 
        this.position.x, this.position.y, 
        this.position.x + MAX_FIRING_RANGE, this.position.y + 20, 
        this.position.x + MAX_FIRING_RANGE, this.position.y - 20, 
        0xfc010e);
    this.scene.physics.add.existing(this.gravGunField);
    this.gravGunField.setOrigin(0, 0);
  }

  /**
   * Provides the sprite's center point on x and y
   *
   * @return object containing the sprite's center point on x and y axes
   */
  public get position(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

  public setPlayerRotation(angle:any ) {
    this.setRotation(angle);
    this.gravGunField.setRotation(angle);
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
    //  const projectile = new GravCannonProjectileSprite(this.scene, this.position.x,this.position.y);

    this.scene.physics.moveTo(triangleProj, cursorX, cursorY, 50);

    const cursorAngle = Phaser.Math.Angle.Between(this.position.x, this.position.y, cursorX, cursorY);


    // return projectile to player after a certain distance travelled
    // TODO: find more elegant way to track distance projectile traveled
    setTimeout(() => {
      const collider = this.scene.physics.add.collider(triangleProj, this, (projectile, player) => {
        console.log('destroying projectile on player impact');
        projectile.destroy();
        collider.destroy();
      });
      this.scene.physics.moveTo(triangleProj, this.position.x, this.position.y);
      this.inFiringCooldown = false;
    }, MAX_FIRING_RANGE);
  }

  public update(): void {
    this.body.velocity.y = this.debris.getRelativeMass() * 100;
    // console.log('Velocity: ', this.body.velocity.y);
    // link triangle position to sprite
    this.gravGunField.body.velocity.y = this.body.velocity.y;
  }

}
