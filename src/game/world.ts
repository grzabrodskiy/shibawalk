import type {
  CarriedItem,
  DestinationKey,
  LevelDefinition,
  RouteStatus,
  WorldProp,
} from './types';

export const PLAYER_SCREEN_RATIO = 0.24;

type RouteDestination = Exclude<DestinationKey, 'home'>;
type RelativeProp = Omit<WorldProp, 'id' | 'x'> & { idSuffix: string; x: number };
type SegmentTemplate = {
  length: number;
  props: RelativeProp[];
};

const DESTINATION_LABELS: Record<DestinationKey, string> = {
  home: 'Home',
  park: 'Park',
  cafe: 'Cafe',
  postOffice: 'Post Office',
  restaurant: 'Restaurant',
  petStore: 'Pet Store',
};

const RANDOM_DESTINATIONS: RouteDestination[] = [
  'cafe',
  'postOffice',
  'restaurant',
  'petStore',
];

const SEGMENT_TEMPLATES: Record<RouteDestination, SegmentTemplate> = {
  park: {
    length: 4600,
    props: [
      { idSuffix: 'home', x: -120, kind: 'home', lane: 'back' },
      { idSuffix: 'tree-1', x: 170, kind: 'tree', lane: 'back' },
      { idSuffix: 'lamp-1', x: 360, kind: 'lamp', lane: 'back' },
      { idSuffix: 'flower-1', x: 460, kind: 'flower', lane: 'front' },
      { idSuffix: 'treat-1', x: 520, kind: 'treat', lane: 'front' },
      { idSuffix: 'bench-1', x: 780, kind: 'bench', lane: 'back' },
      { idSuffix: 'tree-2', x: 940, kind: 'tree', lane: 'back' },
      { idSuffix: 'lamp-2', x: 1160, kind: 'lamp', lane: 'back' },
      { idSuffix: 'treat-2', x: 1210, kind: 'treat', lane: 'front' },
      { idSuffix: 'flower-2', x: 1320, kind: 'flower', lane: 'front' },
      { idSuffix: 'tree-3', x: 1450, kind: 'tree', lane: 'back' },
      { idSuffix: 'bench-2', x: 1710, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-3', x: 1790, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-3', x: 1930, kind: 'lamp', lane: 'back' },
      { idSuffix: 'flower-3', x: 2110, kind: 'flower', lane: 'front' },
      { idSuffix: 'tree-4', x: 2280, kind: 'tree', lane: 'back' },
      { idSuffix: 'bench-3', x: 2510, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-4', x: 2580, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-4', x: 2780, kind: 'lamp', lane: 'back' },
      { idSuffix: 'flower-4', x: 2890, kind: 'flower', lane: 'front' },
      { idSuffix: 'tree-5', x: 3070, kind: 'tree', lane: 'back' },
      { idSuffix: 'bench-4', x: 3310, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-5', x: 3380, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-5', x: 3560, kind: 'lamp', lane: 'back' },
      { idSuffix: 'flower-5', x: 3710, kind: 'flower', lane: 'front' },
      { idSuffix: 'tree-6', x: 3890, kind: 'tree', lane: 'back' },
      { idSuffix: 'bench-5', x: 4140, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-6', x: 4220, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-6', x: 4380, kind: 'lamp', lane: 'back' },
      { idSuffix: 'park', x: 4730, kind: 'park', lane: 'back' },
    ],
  },
  cafe: {
    length: 3900,
    props: [
      { idSuffix: 'tree-1', x: 260, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-1', x: 370, kind: 'flower', lane: 'front' },
      { idSuffix: 'fountain-1', x: 600, kind: 'fountain', lane: 'back' },
      { idSuffix: 'bench-1', x: 930, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-1', x: 980, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-1', x: 1210, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-2', x: 1460, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-2', x: 1540, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-2', x: 1810, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-2', x: 1880, kind: 'treat', lane: 'front' },
      { idSuffix: 'fountain-2', x: 2140, kind: 'fountain', lane: 'back' },
      { idSuffix: 'lamp-2', x: 2390, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-3', x: 2660, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-3', x: 2760, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-3', x: 3010, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-3', x: 3090, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-3', x: 3340, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-4', x: 3530, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-4', x: 3620, kind: 'flower', lane: 'front' },
      { idSuffix: 'cafe', x: 4030, kind: 'cafe', lane: 'back' },
    ],
  },
  postOffice: {
    length: 3500,
    props: [
      { idSuffix: 'lamp-1', x: 280, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-1', x: 470, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-1', x: 590, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-1', x: 860, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-1', x: 930, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-2', x: 1210, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-2', x: 1430, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-2', x: 1520, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-2', x: 1810, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-2', x: 1880, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-3', x: 2220, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-3', x: 2480, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-3', x: 2600, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-3', x: 2880, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-3', x: 2970, kind: 'treat', lane: 'front' },
      { idSuffix: 'postOffice', x: 3630, kind: 'postOffice', lane: 'back' },
    ],
  },
  restaurant: {
    length: 3600,
    props: [
      { idSuffix: 'lamp-1', x: 300, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-1', x: 520, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-1', x: 640, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-1', x: 910, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-1', x: 980, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-2', x: 1290, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-2', x: 1490, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-2', x: 1600, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-2', x: 1900, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-2', x: 1980, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-3', x: 2280, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-3', x: 2520, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-3', x: 2650, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-3', x: 2940, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-3', x: 3010, kind: 'treat', lane: 'front' },
      { idSuffix: 'tree-4', x: 3290, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-4', x: 3390, kind: 'flower', lane: 'front' },
      { idSuffix: 'restaurant', x: 3730, kind: 'restaurant', lane: 'back' },
    ],
  },
  petStore: {
    length: 3400,
    props: [
      { idSuffix: 'lamp-1', x: 250, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-1', x: 430, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-1', x: 560, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-1', x: 820, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-1', x: 900, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-2', x: 1190, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-2', x: 1400, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-2', x: 1510, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-2', x: 1810, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-2', x: 1880, kind: 'treat', lane: 'front' },
      { idSuffix: 'lamp-3', x: 2190, kind: 'lamp', lane: 'back' },
      { idSuffix: 'tree-3', x: 2400, kind: 'tree', lane: 'back' },
      { idSuffix: 'flower-3', x: 2510, kind: 'flower', lane: 'front' },
      { idSuffix: 'bench-3', x: 2810, kind: 'bench', lane: 'back' },
      { idSuffix: 'treat-3', x: 2880, kind: 'treat', lane: 'front' },
      { idSuffix: 'petStore', x: 3530, kind: 'petStore', lane: 'back' },
    ],
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function formatDistance(distance: number) {
  return `${Math.ceil(distance / 44)} m`;
}

function buildSegmentProps(
  destinationKey: RouteDestination,
  startProgress: number,
  levelIndex: number,
) {
  return SEGMENT_TEMPLATES[destinationKey].props.map((prop) => ({
    ...prop,
    id: `level-${levelIndex}-${prop.idSuffix}`,
    x: startProgress + prop.x,
  }));
}

export function createRoutePlan() {
  const destinations = ['park', ...shuffle(RANDOM_DESTINATIONS)] as RouteDestination[];
  const levels: LevelDefinition[] = [];
  const worldProps: WorldProp[] = [];
  let currentStartKey: DestinationKey = 'home';
  let currentStartProgress = 0;

  destinations.forEach((destinationKey, index) => {
    const template = SEGMENT_TEMPLATES[destinationKey];
    const endProgress = currentStartProgress + template.length;
    const levelIndex = index + 1;

    levels.push({
      id: `level-${levelIndex}`,
      index: levelIndex,
      title: `${DESTINATION_LABELS[currentStartKey]} To ${DESTINATION_LABELS[destinationKey]}`,
      startLabel: DESTINATION_LABELS[currentStartKey],
      destinationLabel: DESTINATION_LABELS[destinationKey],
      startKey: currentStartKey,
      destinationKey,
      startProgress: currentStartProgress,
      endProgress,
    });

    worldProps.push(...buildSegmentProps(destinationKey, currentStartProgress, levelIndex));
    currentStartKey = destinationKey;
    currentStartProgress = endProgress;
  });

  return {
    levels,
    worldProps,
  };
}

export function getRouteLength(levels: LevelDefinition[]) {
  return levels[levels.length - 1]?.endProgress ?? 0;
}

export function getLevelForProgress(progress: number, levels: LevelDefinition[]) {
  return levels.find((level) => progress < level.endProgress) ?? levels[levels.length - 1];
}

export function getRouteStatus(progress: number, levels: LevelDefinition[]): RouteStatus {
  const level = getLevelForProgress(progress, levels);
  const levelLength = level.endProgress - level.startProgress;
  const levelProgress = clamp(progress - level.startProgress, 0, levelLength);
  const progressPct = Math.round((levelProgress / levelLength) * 100);
  const distanceToGoal = formatDistance(
    level.endProgress - clamp(progress, level.startProgress, level.endProgress),
  );

  return {
    level,
    progressPct,
    distanceToGoal,
  };
}

export function getDestinationProgress(
  levels: LevelDefinition[],
  destinationKey: DestinationKey,
) {
  return levels.find((level) => level.destinationKey === destinationKey)?.endProgress ?? null;
}

export function getCompletedLevelIndex(progress: number, levels: LevelDefinition[]) {
  let completedLevelIndex = 0;

  for (const level of levels) {
    if (progress < level.endProgress) {
      break;
    }

    completedLevelIndex = level.index;
  }

  return completedLevelIndex;
}

export function getCarriedItemForDestination(
  destinationKey: DestinationKey | null | undefined,
): CarriedItem | null {
  switch (destinationKey) {
    case 'park':
      return 'flowers';
    case 'cafe':
      return 'coffee';
    case 'postOffice':
      return 'parcel';
    case 'restaurant':
      return 'takeout';
    case 'petStore':
      return 'petBag';
    case 'home':
    default:
      return null;
  }
}
