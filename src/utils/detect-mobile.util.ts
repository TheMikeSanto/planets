/**
 * Detects a mobile browser.
 *
 * @returns `true` if browser is mobile `false` otherwise
 */
export function detectMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);
}
