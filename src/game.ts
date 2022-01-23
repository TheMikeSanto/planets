import * as Phaser from 'phaser';
import DebugDrawPlugin from 'phaser-plugin-debug-draw';

import { SETTINGS } from './settings.config';
import {
  GameOverScene,
  MainScene,
  PreloadScene,
} from './scenes';

const plugins = SETTINGS.debug
  ? { scene: [ { key: 'DebugDrawPlugin', plugin: DebugDrawPlugin, mapping: 'debugDraw' } ] }
  : undefined;
export namespace Planets {
  export class Game extends Phaser.Game {
    private static readonly WIDTH = 1200;
    private static readonly HEIGHT = 600;
    private static readonly config = {
      type: Phaser.AUTO,
      backgroundColor: ' #000000',
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'content',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Game.WIDTH,
        height: Game.HEIGHT,
      },
      physics: {
        default: 'arcade',
      },
      plugins,
    };

    constructor() {
      super(Game.config);
      this.scene.add('preloadScene', new PreloadScene());
      this.scene.add('mainScene', new MainScene());
      this.scene.add('gameOverScene', new GameOverScene());
      this.scene.start('preloadScene');
    }
  }
}
