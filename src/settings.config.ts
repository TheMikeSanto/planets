/** Global configuration variables for easily tuning gameplay mechanics/feel */
export const SETTINGS = {
  /** Enables debugging */
  debug: true,
  /** Affects the base scroll rate/debris spawn rate */
  gameSpeed: 1,
  /** Disables audio */
  disableAudio: false,
  /** Disables the failure state */
  disableFailure: false,
  /** Settings to control the behavior of the gravity gun */
  gravityGun: {
    aoeDistance: 10,
    power: 10,
    powerDistanceRatio: 10,
    cooldownTime: 1000,
  },
  /** Color codes for each planet */
  planetColors: {
    bottom: 0x2a24ee,
    // top: 0x6ba154,
    top: 0xffffff,
  }
} as const;
