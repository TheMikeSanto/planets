import * as Phaser from 'phaser';

import { ActionType } from './action-type.enum';
import { PlayerSprite } from '../player.sprite';

type ProjectileSpriteConfig = {
  action: ActionType,
  start: {
    x: number,
    y: number,
  },
  end: {
    x: number,
    y: number,
  },
};

const CONFIG = {
  /** Maximum distance a projectile can get from its origin before dying */
  beamLength: 100,
  /** Projectile movement speed */
  movementSpeed: 200,
};

export class ProjectileSprite extends Phaser.GameObjects.Sprite {
  private action: ActionType;
  private player: PlayerSprite; 

  constructor(player: PlayerSprite, scene: Phaser.Scene, config: ProjectileSpriteConfig) {
    super(scene, config.start.x, config.start.y, 'projectile');
    this.action = config.action;
    this.player = player;
    this.name = `${this.action}`;
    this.setScale(0.2);
    this.setAngle(90);
    this.setTintFill(this.action === ActionType.Pull
        ? 0xff3d3d
        : 0x73e6d8);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    scene.physics.moveTo(this, config.end.x, config.end.y, CONFIG.movementSpeed);
    this.body['pushable'] = false;
  }

  /**
   * Provides the sprite's center point on x and y
   *
   * @return object containing the sprite's center point on x and y axes
   */
  public get position(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

  public update(): void {
    if (Phaser.Math.Distance.BetweenPoints(this, this.player) > CONFIG.beamLength) {
      this.destroy();
    }
  }
}
