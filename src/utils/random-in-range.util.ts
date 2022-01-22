
/**
 * Generates a random number between the given min and max.
 *
 * @param min minimum number
 * @param max maximum number
 * @returns random number between min and max
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}