import * as migration_20250110_123729_initial from './20250110_123729_initial';

export const migrations = [
  {
    up: migration_20250110_123729_initial.up,
    down: migration_20250110_123729_initial.down,
    name: '20250110_123729_initial'
  },
];
