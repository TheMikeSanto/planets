import { DebrisType } from './debris-type.enum';

/** List of all debris asset keys */
export const ASSET_KEYS = {
  [DebrisType.Default]: [
    'debris1',
    'debris2',
    'debris3',
    'debris4',
  ],
  [DebrisType.Special]: [
    'satellite',
    'vanguard',
  ],
} as const;
