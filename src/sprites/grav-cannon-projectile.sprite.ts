import * as Phaser from 'phaser';

const shaderFragmentSrc = [

  "precision mediump float;",

  "uniform vec2      resolution;",
  "uniform float     time;",

  "#define PI 90",

  "void main( void ) {",

  "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",

  "float sx = 0.3 * (p.x + 0.8) * sin( 900.0 * p.x - 1. * pow(time, 0.55)*5.);",

  "float dy = 4./ ( 500.0 * abs(p.y - sx));",

  "dy += 1./ (25. * length(p - vec2(p.x, 0.)));",

  "gl_FragColor = vec4( (p.x + 0.1) * dy, 0.3 * dy, dy, 1.1 );",

"}"];

export class GravCannonProjectileSprite extends Phaser.GameObjects.Sprite {

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'grav-cannon-projectile');
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setScale(0.2);
  }

  /**
   * Provides the sprite's center point on x and y
   *
   * @return object containing the sprite's center point on x and y axes
   */
  public get position(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }

}