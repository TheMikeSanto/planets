import * as Phaser from 'phaser';

import { PlayerSprite } from '../sprites';

export class MainScene extends Phaser.Scene {
  private player: PlayerSprite;

  constructor () {
    super('mainScene');
  }
  
  create () {
    this.add.image(640, 360, 'stars');    
    this.player = new PlayerSprite(this, 400, 70);
  }

  public update(): void {
    const movement = {
      up: this.isPressed('w'),
      down: this.isPressed('s'),
      left: this.isPressed('a'),
      right: this.isPressed('d'),
    }
    this.player.update(movement);
  }

  private isPressed(key: string): boolean {
    return this.input.keyboard.addKey(key).isDown;
  }
}
