import type { LevelDefinition, RouteStatus, WorldProp } from './types';

export const LEVEL_ONE_LENGTH = 4600;
export const LEVEL_TWO_LENGTH = 3900;
export const LEVEL_THREE_LENGTH = 3500;
export const LEVEL_ONE_END = LEVEL_ONE_LENGTH;
export const LEVEL_TWO_END = LEVEL_ONE_END + LEVEL_TWO_LENGTH;
export const LEVEL_LENGTH = LEVEL_TWO_END + LEVEL_THREE_LENGTH;
export const PLAYER_SCREEN_RATIO = 0.24;

export const LEVELS: LevelDefinition[] = [
  {
    id: 'level-1',
    index: 1,
    title: 'Home To Park',
    startLabel: 'Home',
    destinationLabel: 'Park',
    startProgress: 0,
    endProgress: LEVEL_ONE_END,
  },
  {
    id: 'level-2',
    index: 2,
    title: 'Park To Cafe',
    startLabel: 'Park',
    destinationLabel: 'Cafe',
    startProgress: LEVEL_ONE_END,
    endProgress: LEVEL_TWO_END,
  },
  {
    id: 'level-3',
    index: 3,
    title: 'Cafe To Post Office',
    startLabel: 'Cafe',
    destinationLabel: 'Post Office',
    startProgress: LEVEL_TWO_END,
    endProgress: LEVEL_LENGTH,
  },
];

const LEVEL_ONE_PROPS: WorldProp[] = [
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
  { id: 'park-gate', x: LEVEL_ONE_END + 130, kind: 'park', lane: 'back' },
];

const LEVEL_TWO_PROPS: WorldProp[] = [
  { id: 'park-tree-1', x: LEVEL_ONE_END + 260, kind: 'tree', lane: 'back' },
  { id: 'park-flower-1', x: LEVEL_ONE_END + 370, kind: 'flower', lane: 'front' },
  { id: 'park-fountain-1', x: LEVEL_ONE_END + 600, kind: 'fountain', lane: 'back' },
  { id: 'park-bench-1', x: LEVEL_ONE_END + 930, kind: 'bench', lane: 'back' },
  { id: 'park-treat-1', x: LEVEL_ONE_END + 980, kind: 'treat', lane: 'front' },
  { id: 'park-lamp-1', x: LEVEL_ONE_END + 1210, kind: 'lamp', lane: 'back' },
  { id: 'park-tree-2', x: LEVEL_ONE_END + 1460, kind: 'tree', lane: 'back' },
  { id: 'park-flower-2', x: LEVEL_ONE_END + 1540, kind: 'flower', lane: 'front' },
  { id: 'park-bench-2', x: LEVEL_ONE_END + 1810, kind: 'bench', lane: 'back' },
  { id: 'park-treat-2', x: LEVEL_ONE_END + 1880, kind: 'treat', lane: 'front' },
  { id: 'park-fountain-2', x: LEVEL_ONE_END + 2140, kind: 'fountain', lane: 'back' },
  { id: 'park-lamp-2', x: LEVEL_ONE_END + 2390, kind: 'lamp', lane: 'back' },
  { id: 'park-tree-3', x: LEVEL_ONE_END + 2660, kind: 'tree', lane: 'back' },
  { id: 'park-flower-3', x: LEVEL_ONE_END + 2760, kind: 'flower', lane: 'front' },
  { id: 'park-bench-3', x: LEVEL_ONE_END + 3010, kind: 'bench', lane: 'back' },
  { id: 'park-treat-3', x: LEVEL_ONE_END + 3090, kind: 'treat', lane: 'front' },
  { id: 'park-lamp-3', x: LEVEL_ONE_END + 3340, kind: 'lamp', lane: 'back' },
  { id: 'cafe-tree-1', x: LEVEL_ONE_END + 3530, kind: 'tree', lane: 'back' },
  { id: 'cafe-flower-1', x: LEVEL_ONE_END + 3620, kind: 'flower', lane: 'front' },
  { id: 'cafe', x: LEVEL_TWO_END + 130, kind: 'cafe', lane: 'back' },
];

const LEVEL_THREE_PROPS: WorldProp[] = [
  { id: 'cafe-lamp-1', x: LEVEL_TWO_END + 280, kind: 'lamp', lane: 'back' },
  { id: 'cafe-tree-2', x: LEVEL_TWO_END + 470, kind: 'tree', lane: 'back' },
  { id: 'cafe-flower-2', x: LEVEL_TWO_END + 590, kind: 'flower', lane: 'front' },
  { id: 'cafe-bench-1', x: LEVEL_TWO_END + 860, kind: 'bench', lane: 'back' },
  { id: 'cafe-treat-1', x: LEVEL_TWO_END + 930, kind: 'treat', lane: 'front' },
  { id: 'street-lamp-1', x: LEVEL_TWO_END + 1210, kind: 'lamp', lane: 'back' },
  { id: 'street-tree-1', x: LEVEL_TWO_END + 1430, kind: 'tree', lane: 'back' },
  { id: 'street-flower-1', x: LEVEL_TWO_END + 1520, kind: 'flower', lane: 'front' },
  { id: 'street-bench-1', x: LEVEL_TWO_END + 1810, kind: 'bench', lane: 'back' },
  { id: 'street-treat-1', x: LEVEL_TWO_END + 1880, kind: 'treat', lane: 'front' },
  { id: 'street-lamp-2', x: LEVEL_TWO_END + 2220, kind: 'lamp', lane: 'back' },
  { id: 'street-tree-2', x: LEVEL_TWO_END + 2480, kind: 'tree', lane: 'back' },
  { id: 'street-flower-2', x: LEVEL_TWO_END + 2600, kind: 'flower', lane: 'front' },
  { id: 'street-bench-2', x: LEVEL_TWO_END + 2880, kind: 'bench', lane: 'back' },
  { id: 'street-treat-2', x: LEVEL_TWO_END + 2970, kind: 'treat', lane: 'front' },
  { id: 'post-office', x: LEVEL_LENGTH + 130, kind: 'postOffice', lane: 'back' },
];

export const WORLD_PROPS: WorldProp[] = [
  ...LEVEL_ONE_PROPS,
  ...LEVEL_TWO_PROPS,
  ...LEVEL_THREE_PROPS,
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDistance(distance: number) {
  return `${Math.ceil(distance / 44)} m`;
}

export function getLevelForProgress(progress: number) {
  return LEVELS.find((level) => progress < level.endProgress) ?? LEVELS[LEVELS.length - 1];
}

export function getRouteStatus(progress: number): RouteStatus {
  const level = getLevelForProgress(progress);
  const levelLength = level.endProgress - level.startProgress;
  const levelProgress = clamp(progress - level.startProgress, 0, levelLength);
  const progressPct = Math.round((levelProgress / levelLength) * 100);
  const distanceToGoal = formatDistance(level.endProgress - clamp(progress, level.startProgress, level.endProgress));

  return {
    level,
    progressPct,
    distanceToGoal,
  };
}
