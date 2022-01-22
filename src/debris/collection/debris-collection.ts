import { DebrisSource } from '../debris-source.enum';
import { CollectedDebris } from './collected-debris.type';

/** Manages the player's collected debris */
export class DebrisCollection {
  private readonly collection = {
    [DebrisSource.Bottom]: [],
    [DebrisSource.Top]: [],
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
}
