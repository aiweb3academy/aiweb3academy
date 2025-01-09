import * as migration_20250109_143222_initial from './20250109_143222_initial';

export const migrations = [
  {
    up: migration_20250109_143222_initial.up,
    down: migration_20250109_143222_initial.down,
    name: '20250109_143222_initial'
  },
];
