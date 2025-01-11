import * as migration_20250110_123729_initial from './20250110_123729_initial';
import * as migration_20250111_145600 from './20250111_145600';

export const migrations = [
  {
    up: migration_20250110_123729_initial.up,
    down: migration_20250110_123729_initial.down,
    name: '20250110_123729_initial',
  },
  {
    up: migration_20250111_145600.up,
    down: migration_20250111_145600.down,
    name: '20250111_145600'
  },
];
