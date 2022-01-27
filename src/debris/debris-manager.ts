import * as _ from 'lodash';
import * as Phaser from 'phaser';

import { DebrisType } from './debris-type.enum';
import {
  DebrisSprite,
  PlayerSprite
} from '../sprites';
import { ActionType } from '../sprites/grav-cannon';
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
  private group: Phaser.GameObjects.Group;
  private planetGroup: Phaser.GameObjects.Group;
  private player: PlayerSprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: PlayerSprite, planetGroup: Phaser.GameObjects.Group) {
    this.scene = scene;
    this.player = player;
    this.planetGroup = planetGroup;
    this.barrier = this.scene.add.sprite(-100, this.scene.scale.height / 2, 'barrier');
    this.scene.physics.add.existing(this.barrier);
    this.barrier.body['immovable'] = true;
    this.group = scene.add.group([], { runChildUpdate: true });
    this.registerGroupColliders();
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

  /**
   * Creates collisions between the debris group and other related physics groups.
   */
  private registerGroupColliders(): void {
    this.scene.physics.add.collider(this.group, this.planetGroup);
    this.scene.physics.add.collider(this.group, this.group);
    this.scene.physics.add.overlap(this.group, this.player.projectileGroup,
      (debris, projectile) => {
      const type = projectile.name === `${ActionType.Pull}`
        ? ActionType.Pull
        : ActionType.Push;
      const { x, y } = this.player.position;
      if (type === ActionType.Push) {
        this.scene.physics.moveTo(debris, x, y, -500)
      } else {
        const speed = 100;
        (<Phaser.Physics.Arcade.Body> debris.body).setMaxVelocity(speed, speed);
        this.scene.physics.moveTo(debris, x, y, speed);
      }
    });
    this.scene.physics.add.collider(this.barrier, this.group, (barrier, debris) => {
      this.group.remove(debris, true, true);
    });
  }

  /**
   * Takes the given object and registers a physics collider between the object and the player
   * sprite
   *
   * @param debris a single debris to be registered as a collider
   */
  private registerPlayerCollider(debris: DebrisSprite): void {
    const playerCollider = this.scene.physics.add.collider(this.player, debris, (player, body) => {
      playerCollider.destroy();
      this.player.collectDebris(debris.collectionData);
      this.group.remove(debris, true, true);
    });
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
      this.group.add(debris);
      this.registerPlayerCollider(debris);
    });
  }
}
