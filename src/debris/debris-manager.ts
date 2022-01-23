import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { DebrisType } from './debris-type.enum';
import {
  DebrisSprite,
  PlayerSprite
} from '../sprites';
import { randomInRange } from '../utils';

const CONFIG = {
  /** Time in ms between spawn events */
  spawnRate: 3000,
  /** Time in ms between special spawn events */
  specialSpawnRate: 6000,
  /** Number of objects to spawn on startup */
  numDebrisOnStart: 10,
  /** Number of objects to spawn per interval */
  numDebrisPerInterval: 10,
  /** Number of special debris objects to spawn per interval */
  numSpecialsPerInterval: 1,
} as const;

/** Manages all of the debris for the entire game state */
export class DebrisManager {
  private barrier: Phaser.GameObjects.Sprite;
  private debris: DebrisSprite[] = [];
  private player: PlayerSprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: PlayerSprite) {
    this.scene = scene;
    this.player = player;
    this.barrier = this.scene.add.sprite(-100, 0, 'barrier');
    this.scene.physics.add.existing(this.barrier);
  }

  /**
   * Begins debris spawning.
   */
  public start(): void {
    this.spawnDebris(CONFIG.numDebrisOnStart);
    this.scene.time.addEvent({
      callback: () => this.spawnDebris(CONFIG.numDebrisPerInterval),
      delay: CONFIG.spawnRate,
      loop: true,
    });
    this.scene.time.addEvent({
      callback: () => this.spawnDebris(CONFIG.numSpecialsPerInterval, DebrisType.Special),
      delay: CONFIG.specialSpawnRate,
      loop: true,
    });
  }

  public update(): void {
    this.debris.forEach(aDebris => {
      aDebris.update()
      this.registerProjectileColliders(aDebris);
    });
  }

  /**
   * Removes the given debris from the debris array and destroyts it.
   *
   * @param debris debris to be destroyed/removed
   */
  private destroy(debris: DebrisSprite): void {
    const index = this.debris.indexOf(debris);
    if (index) this.debris.splice(index, 1);
    debris.destroy();
  }

  /**
   * Takes the given object and registers a physics collider between the object and the player
   * sprite
   *
   * @param debris a single debris to be registered as a collider
   */
  private registerSpawnColliders(debris: DebrisSprite): void {
    const playerCollider = this.scene.physics.add.collider(this.player, debris, (player, body) => {
      playerCollider.destroy();
      this.player.collectDebris(debris.collectionData);
      this.destroy(debris);
    });
    this.scene.physics.add.collider(this.barrier, debris, (barrier, body) => {
      this.destroy(debris);
    });
  }

  /**
   * Takes the given object and registers a physics collider between the object and the player
   * sprite
   *
   * @param debris a single debris to be registered as a collider
   */
     private registerProjectileColliders(debris: DebrisSprite): void {
       const gravProjectiles = this.player.gravProjectiles;
       gravProjectiles.forEach(proj => {
         const gravProjCollider = this.scene.physics.add.collider(proj, debris, (proj, body) => {
          gravProjCollider.destroy();
          // TEMP destroy it
          if (proj['projType'] === 'push') {
            debris.body.velocity.x = -1*debris.body.velocity.x
          } else if (proj['projType'] === 'pull') {
            console.log(`debris captured with proj.age ${proj['age']}`);
            this.player.collectDebris(debris.collectionData);
            this.destroy(debris);
          }
         })
       })
    }


  /**
   * Creates the given number of debris objects and registers appropriate physics colliders.
   *
   * @param numDebris number of debris objects to spawn
   * @param debrisType optional. specifies the type of debris to spawn
   */
  private spawnDebris(numDebris: number, debrisType = DebrisType.Default): void {
    [...Array(numDebris)].map(() => {
      const debris = new DebrisSprite(this.scene, randomInRange(80, 500), debrisType);
      this.registerSpawnColliders(debris);
      this.debris.push(debris);
    });
  }

  /**
   * Determines the percentage of the total population belonging to each segment of
   * debris ordered by size.
   *
   * @returns breakdown of percentages of each segment
   */
  private getSegmentsBySize(): { small: number, medium: number, large: number } {
    const limits = { small: 0.09, medium: 0.17, large: 0.25 }
    const total = this.debris.length;
    const small = _.filter(this.debris, debris => debris.size <= limits.small)
      .length / total;
    const medium = _.filter(this.debris,
      debris => debris.size > limits.small && debris.size <= limits.medium)
      .length / total;
    const large = _.filter(this.debris,
      debris => debris.size > limits.medium && debris.size <= limits.large)
      .length / total;
    return { small, medium, large };
  }

}
