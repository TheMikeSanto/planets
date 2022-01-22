import { DebrisSource } from '../debris-source.enum';

/** Data model representing a piece of debris that has been collected */
export type CollectedDebris = {
  /** Source planet */
  sourcePlanet: DebrisSource;
  /** Relative mass of the debris */
  mass: number;
};
