/** Global configuration variables for easily tuning gameplay mechanics/feel */
export const SETTINGS = {
  /** Hex values for various colors */
  colors: {
    gravBeam: {
      push: [0x73e6d8, 0xb5fff6],
      pull: [0xff3d3d, 0xff7a7a],
    },
    planets: {
      bottom: 0x1C4EF3,
      top: 0xffffff,
    }
  },
  /** Enables debugging */
  debug: false,
  /** Affects the base scroll rate/debris spawn rate */
  gameSpeed: 1,
  /** Disables audio */
  disableAudio: true,
  /** Disables the failure state */
  disableFailure: false,
  /** Affects the amount of gravity per mass */
  gravityFactor: 100,
  /** Settings to control the behavior of the gravity gun */
  gravityGun: {
    /** Maximum distance a projectile can get from its origin before dying */
    beamLength: 100,
    aoeDistance: 10,
    power: 10,
    powerDistanceRatio: 10,
    cooldownTime: 1000,
  },
} as const;
