import * as Phaser from 'phaser';

import { ActionType } from '../../sprites/grav-cannon';
import {
  PlayerSprite,
  RotationDirection,
} from '../../sprites/player';

export class ControlManager {
  private readonly events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
  private readonly keys: {
    w: Phaser.Input.Keyboard.Key,
    a: Phaser.Input.Keyboard.Key,
    s: Phaser.Input.Keyboard.Key,
    d: Phaser.Input.Keyboard.Key,
    space: Phaser.Input.Keyboard.Key,
  };
  private player: PlayerSprite;
  private scene: Phaser.Scene;

  constructor(player: PlayerSprite) {
    this.player = player;
    this.scene = this.player.scene;
    this.keys = {
      w: this.scene.input.keyboard.addKey('W'),
      a: this.scene.input.keyboard.addKey('A'),
      s: this.scene.input.keyboard.addKey('S'),
      d: this.scene.input.keyboard.addKey('D'),
      space: this.scene.input.keyboard.addKey('SPACE'),
    };
    this.registerKeyboardListeners();
    this.registerInputListeners();
  }

  public on(event: string, callback: Function): void {
    this.events.on(event, callback);
  }

  // emit an event for grav gun begin/start
  // emit an event for rotation
  private emit(event: string, args?): void {
    this.events.emit(event, args);
  }

  /**
   * Determine the angle between the player and mouse cursor
   * @returns the angle between the player and the mouse cursor
   */
  private getCursorAngle(): number {
    return Phaser.Math.Angle.Between(this.player.position.x, this.player.position.y,
      this.scene.input.x, this.scene.input.y);
  }

  private registerInputListeners(): void {
    this.scene.input.on('pointerdown', pointer => {
      if (pointer.rightButtonDown()) this.emit('gravBeamStart', ActionType.Push);
      if (pointer.leftButtonDown()) this.emit('gravBeamStart', ActionType.Pull);
    });
    this.scene.input.on('pointerup', () => this.emit('gravBeamStop'));
    this.scene.input.on('pointermove', () => {
      if (this.scene.input.x !== 0 && this.scene.input.y !== 0) {
        this.emit('rotatePlayerTo', this.getCursorAngle() - Math.PI / 2);
      }
    })
  }

  private registerKeyboardListeners(): void {
    this.keys.w.on('down', () => console.log('key'));
    this.keys.w.on('down', () => this.emit('gravBeamStart', ActionType.Push));
    this.keys.w.on('up', () => this.emit('gravBeamStop'));
    this.keys.s.on('down', () => this.emit('gravBeamStart', ActionType.Pull));
    this.keys.s.on('up', () => this.emit('gravBeamStop'));
    this.keys.space.on('down', () => this.emit('usedWarpCore'));
    this.keys.a.on('down', () => this.emit('rotatePlayerStart', RotationDirection.Left));
    this.keys.a.on('up', () => this.emit('rotatePlayerStop'));
    this.keys.d.on('down', () => this.emit('rotatePlayerStart', RotationDirection.Right));
    this.keys.d.on('up', () => this.emit('rotatePlayerStop'));
  }
}
