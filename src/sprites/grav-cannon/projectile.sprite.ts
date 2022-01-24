import * as Phaser from 'phaser';

import { ActionType } from './action-type.enum';

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
  /** Projectile's lifespan in ticks */
  maxLifespanTicks: 40,
  /** Projectile movement speed */
  movementSpeed: 1000,
};

export class ProjectileSprite extends Phaser.GameObjects.Sprite {
  public age = 0;
  public action: ActionType;

  constructor(scene: Phaser.Scene, config: ProjectileSpriteConfig) {
    super(scene, config.start.x, config.start.y, 'grav-cannon-projectile');
    this.name = `${config.action}`;
    this.action = config.action;
    this.setScale(0.7);
    this.setVisible(false);
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
    ++this.age;
    if (++this.age >= CONFIG.maxLifespanTicks) this.destroy();
  }
}
