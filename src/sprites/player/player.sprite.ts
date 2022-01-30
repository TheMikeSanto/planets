import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { SETTINGS } from '../../settings.config';
import { RotationDirection } from './rotation-direction.enum';
import {
  CollectedDebris,
  DebrisCollection,
  DebrisSource,
} from '../../debris';
import {
  ActionType,
  ProjectileSprite,
} from '../grav-cannon';

const ROTATION_SPEED = 1 * Math.PI; // radians/second

export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private crashed = false;
  private readonly debris: DebrisCollection = new DebrisCollection();
  private gravCannonAction: ActionType = ActionType.Pull;
  private inFiringCooldown = false;
  private isFiring = false;
  private isReturningToCenter = false;
  private isRotating = false;
  private projectiles: Phaser.GameObjects.Group;
  private rotationDirection: RotationDirection;
  private readonly sounds: {
    collectionBottom: Phaser.Sound.BaseSound,
    collectionTop: Phaser.Sound.BaseSound,
    crash: Phaser.Sound.BaseSound,
    warp: Phaser.Sound.BaseSound,
  };
  private startPosition;
  private warpCoreCount = 3;

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'player', 4);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body['pushable'] = false;
    this.setDepth(1);
    this.setScale(0.3);
    this.setRotation(3*Math.PI/2);
    this.startPosition = { x, y };
    this.projectiles = scene.add.group([], { runChildUpdate: true });
    this.sounds = {
      collectionBottom: scene.sound.add('low-bump'),
      collectionTop: scene.sound.add('plop'),
      crash: scene.sound.add('crash'),
      warp: scene.sound.add('warp'),
    }
    scene.anims.create({
      key: 'ship-open',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 0, first: 4 }),
      frameRate: 20,
      repeat: 0,
    });
    scene.anims.create({
      key: 'ship-close',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4, first: 0 }),
    });
    this.play('ship-close');
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
   * Adds the given debris to the player's debris collection and triggers associated
   * audio/animations.
   *
   * @param debris debris to be collected
   */
  public collectDebris(debris: CollectedDebris): void {
    this.debris.add(debris);
    this.maybePlayCollectionAudio(debris.source);
  }
  
  public getDebris() {
    return this.debris.getDebris();
  }

  public returnToCenter(): void {
    this.isReturningToCenter = true;
    (<Phaser.Physics.Arcade.Body> this.body).setVelocity(0, 0);
    this.scene.physics.moveTo(this, this.startPosition.x, this.startPosition.y, 200, 500)
    this.scene.time.addEvent({
      callback: () => this.isReturningToCenter = false,
      delay: 500,
    });
  }

  /**
   * Sets the rotation of the Player + Grav Gun Field together
   * @param angle angle in radians
   */
   public setPlayerRotation(angle: number) {
    if (this.crashed) return;
    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      angle,
      ROTATION_SPEED * 0.01,
    );
  }

  /**
   * Plays sounds and animation for the crashed state.
   */
  public showCrash(): void {
    this.crashed = true;
    this.body.velocity.y = 0;
    this.play('ship-close');
    this.sounds.crash.play();
  }

  /**
   * Fires the Gravity Cannon (if it is not in cooldown)
   *
   * @param projType Type of projectile: 'push' or 'pull
   */
  public startGravityCannon(actionType: ActionType): void {
    if (this.inFiringCooldown || this.crashed) return;
    this.play('ship-open');
    this.gravCannonAction = actionType;
    this.isFiring = true;
  }

  public startRotation(direction: RotationDirection): void {
    if (this.crashed) return;
    this.isRotating = true;
    this.rotationDirection = direction;
  }

  public stopRotation(): void {
    this.isRotating = false;
    this.rotationDirection = undefined;
  }

  public stopGravityCannon(): void {
    this.play('ship-close');
    this.isFiring = false;
    this.inFiringCooldown = false;
    this.projectileGroup.clear(false, true);
  }

  public update(): void {
    if (this.crashed) return;
    if (this.isFiring) this.createProjectile();
    if (this.isRotating) this.adjustRotation(this.rotationDirection);
    if (!this.isReturningToCenter) {
      this.body.velocity.y = this.debris.getRelativeMass() * SETTINGS.gravityFactor;
    }
  }

  public useWarpCore(): number {
    this.warpCoreCount = --this.warpCoreCount || 0;
    this.debris.addWarpCore();
    this.sounds.warp.play();
    return this.warpCoreCount;
  }

  private adjustRotation(direction: RotationDirection): void {
    if (direction === RotationDirection.Left) {
      this.rotation -= 0.05;
    } else {
      this.rotation += 0.05;
    }
  }

  private createProjectile() {
    const projectileTarget = {
      // requires Pi/2 adjustment to offset original sprite rotation
      x: this.position.x + 100*Math.cos(this.rotation + Math.PI/2),
      y: this.position.y + 100*Math.sin(this.rotation + Math.PI/2)
    }
    const projectile = new ProjectileSprite(this, this.scene, {
      action: this.gravCannonAction,
      start: {
        x: this.position.x,
        y: this.position.y,
      },
      end: projectileTarget
    });
    this.projectileGroup.add(projectile);
  }

  /**
   * Plays collection audio for the given debris source if audio is not disabled by global
   * setting.
   *
   * @param source source of debris that was collected
   */
  private maybePlayCollectionAudio(source: DebrisSource): void {
    (source === DebrisSource.Bottom 
      ? this.sounds.collectionBottom
      : this.sounds.collectionTop).play();
  }
}
