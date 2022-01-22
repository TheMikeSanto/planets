import * as Phaser from 'phaser';

import {
  DebrisSprite,
  PlayerSprite
} from '../../sprites';
import { randomInRange } from '../../utils';

/** Manages all of the debris for the entire game state */
export class DebrisManager {
  private debris: DebrisSprite[] = [];
  private player: PlayerSprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: PlayerSprite) {
    this.scene = scene;
    this.player = player;
  }

  /**
   * Begins debris spawning.
   */
  public start(): void {
    this.scene.time.addEvent({
      callback: () => this.spawnDebris(3),
      delay: 2000,
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
  private registerPlayerCollider(body: Phaser.GameObjects.Sprite): void {
    this.scene.physics.add.collider(this.player, body, (player, body) => {
      console.log('collision', body);
    });
  }

  /**
   * Creates the given number of debris objects and registers appropriate physics colliders.
   *
   * @param numDebris number of debris objects to spawn
   */
  private spawnDebris(numDebris: number): void {
    [...Array(numDebris)].map(() => {
      const debris = new DebrisSprite(this.scene, randomInRange(80, 500));
      this.registerPlayerCollider(debris);
      this.debris.push(debris);
    });
  }
}
