import * as Phaser from 'phaser';

export class PlanetSprite extends Phaser.GameObjects.Sprite {

  /**
   * 
   * @param scene scene to add the sprite to
   * @param y y coordinate for placement
   * @param tint optional. hex value to be applied as tint to the sprite
   */
  constructor(scene: Phaser.Scene, y: number,  tint?: number) {
    super(scene, scene.scale.width / 2, y, 'big-planet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body['immovable'] = true;
    (<Phaser.Physics.Arcade.Body> this.body).setSize(this.width, this.height - 120);
    if (tint) this.setTint(tint);
  }
}
