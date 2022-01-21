import * as Phaser from 'phaser';

export class PlanetTileSprite extends Phaser.GameObjects.TileSprite {

  /**
   * 
   * @param scene scene to add the sprite to
   * @param y y coordinate for placement
   * @param assetKey key name of the image asset to use for the sprite
   */
  constructor(scene: Phaser.Scene, y: number, assetKey: string) {
    super(scene, 600, y, 1200, 40, assetKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body['immovable'] = true;
  }
}