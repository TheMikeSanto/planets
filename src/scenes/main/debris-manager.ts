import * as _ from 'lodash';
import * as Phaser from 'phaser';

import {
  DebrisSprite,
  PlayerSprite
} from '../../sprites';
import { randomInRange } from '../../utils';

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
    this.spawnDebris(4);
    this.scene.time.addEvent({
      callback: () => this.spawnDebris(1),
      delay: 3000,
      loop: true,
    });
  }

  public update(): void {
    this.debris.forEach(aDebris => aDebris.update());
  }

  /**
   * Takes the given object and registers a physics collider between the object and the player
   * sprite
   *
   * @param body body to be registered as a collider
   */
  private registerColliders(debris: DebrisSprite): void {
    this.scene.physics.add.collider(this.player, debris, (player, body) => {
      // console.log('collision', body);
    });
    this.scene.physics.add.collider(this.barrier, debris, (barrier, body) => {
      const index = this.debris.indexOf(debris);
      if (index) this.debris.splice(index, 1);
      debris.destroy();
    });
  }

  /**
   * Creates the given number of debris objects and registers appropriate physics colliders.
   *
   * @param numDebris number of debris objects to spawn
   */
  private spawnDebris(numDebris: number): void {
    console.log(this.getSegmentsBySize());
    [...Array(numDebris)].map(() => {
      const debris = new DebrisSprite(this.scene, randomInRange(80, 500));
      this.registerColliders(debris);
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
    const limits = { small: 0.33, medium: 0.66, large: 1 }
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
