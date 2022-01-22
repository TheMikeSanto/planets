import * as _ from 'lodash';

import { DebrisSource } from '../debris-source.enum';
import { CollectedDebris } from './collected-debris.type';

/** Manages the player's collected debris */
export class DebrisCollection {
  private readonly collection = {
    [DebrisSource.Bottom]: <CollectedDebris[]> [],
    [DebrisSource.Top]: <CollectedDebris[]>[],
  };
  constructor() {}

  /**
   * Adds the given debris object to the collection.
   *
   * @param debris debris to be added to the collection
   */
  public add(debris: CollectedDebris): void {
    this.collection[debris.sourcePlanet].push(debris);
    console.log(this.collection);
  }

  /**
   * Calculates the difference between collected mass from both planets.
   */
  public getRelativeMass(): number {
    const topMass = _.chain(this.collection[DebrisSource.Top])
      .map(debris => debris.mass)
      .sum()
      .value();
    const bottomMass = _.chain(this.collection[DebrisSource.Bottom])
      .map(debris => debris.mass)
      .sum()
      .value();
    console.log('Bottom mass: ', bottomMass, 'Top mass: ', topMass, 'Relative: ', bottomMass - topMass);
    return bottomMass - topMass;
  }
}
