import type { WorldProp } from './types';

export const LEVEL_LENGTH = 4600;
export const PLAYER_SCREEN_RATIO = 0.24;

export const WORLD_PROPS: WorldProp[] = [
  { id: 'home', x: -120, kind: 'home', lane: 'back' },
  { id: 'tree-1', x: 170, kind: 'tree', lane: 'back' },
  { id: 'lamp-1', x: 360, kind: 'lamp', lane: 'back' },
  { id: 'flower-1', x: 460, kind: 'flower', lane: 'front' },
  { id: 'treat-1', x: 520, kind: 'treat', lane: 'front' },
  { id: 'bench-1', x: 780, kind: 'bench', lane: 'back' },
  { id: 'tree-2', x: 940, kind: 'tree', lane: 'back' },
  { id: 'lamp-2', x: 1160, kind: 'lamp', lane: 'back' },
  { id: 'treat-2', x: 1210, kind: 'treat', lane: 'front' },
  { id: 'flower-2', x: 1320, kind: 'flower', lane: 'front' },
  { id: 'tree-3', x: 1450, kind: 'tree', lane: 'back' },
  { id: 'bench-2', x: 1710, kind: 'bench', lane: 'back' },
  { id: 'treat-3', x: 1790, kind: 'treat', lane: 'front' },
  { id: 'lamp-3', x: 1930, kind: 'lamp', lane: 'back' },
  { id: 'flower-3', x: 2110, kind: 'flower', lane: 'front' },
  { id: 'tree-4', x: 2280, kind: 'tree', lane: 'back' },
  { id: 'bench-3', x: 2510, kind: 'bench', lane: 'back' },
  { id: 'treat-4', x: 2580, kind: 'treat', lane: 'front' },
  { id: 'lamp-4', x: 2780, kind: 'lamp', lane: 'back' },
  { id: 'flower-4', x: 2890, kind: 'flower', lane: 'front' },
  { id: 'tree-5', x: 3070, kind: 'tree', lane: 'back' },
  { id: 'bench-4', x: 3310, kind: 'bench', lane: 'back' },
  { id: 'treat-5', x: 3380, kind: 'treat', lane: 'front' },
  { id: 'lamp-5', x: 3560, kind: 'lamp', lane: 'back' },
  { id: 'flower-5', x: 3710, kind: 'flower', lane: 'front' },
  { id: 'tree-6', x: 3890, kind: 'tree', lane: 'back' },
  { id: 'bench-5', x: 4140, kind: 'bench', lane: 'back' },
  { id: 'treat-6', x: 4220, kind: 'treat', lane: 'front' },
  { id: 'lamp-6', x: 4380, kind: 'lamp', lane: 'back' },
  { id: 'park', x: LEVEL_LENGTH + 130, kind: 'park', lane: 'back' },
];

export function formatDistanceToPark(progress: number) {
  const remaining = Math.max(0, LEVEL_LENGTH - progress);
  return `${Math.ceil(remaining / 44)} m`;
}
