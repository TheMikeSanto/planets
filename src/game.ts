import * as Phaser from 'phaser';
import DebugDrawPlugin from 'phaser-plugin-debug-draw';

import { SETTINGS } from './settings.config';
import {
  CreditsScene,
  HelpScene,
  GameOverScene,
  MainScene,
  PauseScene,
  PreloadScene,
  TitleScene,
  UiScene,
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
      disableContextMenu: true,
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
      this.sound.volume = 0.3;
      this.sound.mute = SETTINGS.disableAudio;
      const uiScene = new UiScene();
      this.scene.add('creditsScene', new CreditsScene());
      this.scene.add('helpScene', new HelpScene());
      this.scene.add('pauseScene', new PauseScene());
      this.scene.add('preloadScene', new PreloadScene());
      this.scene.add('titleScene', new TitleScene());
      this.scene.add('mainScene', new MainScene(uiScene));
      this.scene.add('gameOverScene', new GameOverScene());
      this.scene.add('uiScene', uiScene);
      this.scene.start('preloadScene');
    }
  }
}
