import type {
  ActiveEvent,
  Direction,
  DogCoat,
  GameState,
  IntentProfile,
  MoodSummary,
  OwnerHaircut,
  OwnerHeadwear,
  OwnerOutfit,
} from './types';
import {
  PLAYER_SCREEN_RATIO,
  createRoutePlan,
  getCompletedLevelIndex,
  getLevelForProgress,
  getRouteLength,
} from './world';

const MAX_PULL_RESERVE = 100;
const PULL_DRAIN_PER_SECOND = 34;
const PULL_RECOVERY_PER_SECOND = 24;
const BRACE_RECOVERY_BONUS = 16;
const BRACE_DAMPING = 0.58;
const TREAT_BOOST_DURATION = 4.8;
export const TREAT_VISUAL_DURATION = 0.9;
const SCREAM_DURATION = 1.2;
const TAU = Math.PI * 2;
const SHIBA_NOSE_OFFSET = 42;
const DOG_NOSE_OFFSET = 96;
const DOG_WAIT_DURATION = 2;
const DOG_RELEASE_SPEED = 94;
const CAT_COATS = ['classic', 'orangeTabby', 'white'] as const;
const REGULAR_DOG_COATS = ['sand', 'charcoal', 'cream'] as const;
const BIG_DOG_COATS = ['shepherd', 'blackTan', 'mahogany'] as const;
const OWNER_OUTFITS = ['slate', 'forest', 'mustard', 'berry'] as const;
const OWNER_HAIRCUTS = ['bob', 'wavy', 'pixie', 'ponytail'] as const;
const OWNER_HEADWEAR = ['none', 'beanie', 'baseballCap', 'beret', 'topHat'] as const;
const BIG_DOG_HANDLER_LINES: Record<OwnerHeadwear, readonly string[]> = {
  none: [
    'Wow! Is it a shiba?',
    'Wow! Look, a shiba!',
    'Wow! Such a shiba attitude.',
  ],
  beanie: [
    'Wow! That shiba looks determined.',
    'Wow! Tiny dog, big opinions.',
    'Wow! That little floof means business.',
  ],
  baseballCap: [
    'Wow! Cool doge, bro.',
    'Wow! That shiba is awesome.',
    'Wow! Tiny legend on the sidewalk.',
  ],
  beret: [
    'Wow! What a charming little dog.',
    'Wow! Such poise for such a tiny creature.',
    'Wow! That shiba has impeccable style.',
  ],
  topHat: [
    'Wow! What an amusing creature.',
    'Wow! What a distinguished little shiba.',
    'Wow! That is a delightfully dramatic dog.',
  ],
};
const LEVEL_COMPLETE_DISPLAY_DURATION = 3;

const BASE_MOODS: Array<IntentProfile & { weight: number }> = [
  {
    label: 'Confident trot',
    description: 'She is feeling cooperative and happily pulls the walk forward.',
    direction: 1,
    speed: 58,
    weight: 34,
  },
  {
    label: 'Curious sniff-walk',
    description: 'She is moving the right way, but every leaf deserves inspection.',
    direction: 1,
    speed: 34,
    weight: 26,
  },
  {
    label: 'Tiny pause',
    description: 'She freezes for a second to evaluate the neighborhood.',
    direction: 0,
    speed: 0,
    weight: 12,
  },
  {
    label: 'Homesick glance',
    description: 'She keeps looking behind, tempted to wander back the way she came.',
    direction: -1,
    speed: 32,
    weight: 12,
  },
  {
    label: 'Reverse zoomies',
    description: 'A sudden burst of energy points entirely the wrong way.',
    direction: -1,
    speed: 64,
    weight: 6,
  },
  {
    label: 'Polite shuffle',
    description: 'She is technically helping, but only just.',
    direction: 1,
    speed: 22,
    weight: 10,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickCatCoat() {
  return CAT_COATS[Math.floor(Math.random() * CAT_COATS.length)];
}

function pickRegularDogCoat(): DogCoat {
  return pickOne(REGULAR_DOG_COATS);
}

function pickBigDogCoat(): DogCoat {
  return pickOne(BIG_DOG_COATS);
}

function pickOwnerOutfit(): OwnerOutfit {
  return pickOne(OWNER_OUTFITS);
}

function pickOwnerHaircut(): OwnerHaircut {
  return pickOne(OWNER_HAIRCUTS);
}

function pickOwnerHeadwear(): OwnerHeadwear {
  return pickOne(OWNER_HEADWEAR);
}

function pickBigDogHandlerLine(headwear: OwnerHeadwear) {
  return pickOne(BIG_DOG_HANDLER_LINES[headwear]);
}

function pickOne<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function advanceStridePhase(
  phase: number,
  speed: number,
  dt: number,
  minSpeed: number,
  baseCadence: number,
  maxCadence: number,
) {
  if (speed <= minSpeed) {
    return phase;
  }

  const normalized = clamp((speed - minSpeed) / 120, 0, 1);
  const cadence = baseCadence + (maxCadence - baseCadence) * normalized;
  return phase + cadence * TAU * dt;
}

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let target = Math.random() * total;

  for (const item of items) {
    target -= item.weight;
    if (target <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function pickBaseMood(): IntentProfile {
  const { weight: _weight, ...mood } = weightedPick(BASE_MOODS);
  return mood;
}

function pickRandomDirection(): Direction {
  const value = Math.random();
  if (value < 0.42) {
    return -1;
  }
  if (value < 0.76) {
    return 1;
  }
  return 0;
}

function getShibaScreenX(stageWidth: number) {
  const playerX = clamp(stageWidth * PLAYER_SCREEN_RATIO, 96, 250);
  return playerX + clamp(stageWidth * 0.16, 88, 170);
}

function createBigDogEvent(stageWidth: number): ActiveEvent {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const speed = 84;
  const travelDistance = stageWidth + 320;
  const ownerHeadwear = pickOwnerHeadwear();

  return {
    type: 'bigDog',
    dogCoat: pickBigDogCoat(),
    ownerOutfit: pickOwnerOutfit(),
    ownerHaircut: pickOwnerHaircut(),
    ownerHeadwear,
    label: 'A big dog approaches',
    description: 'A large dog and its human come through, and the shiba wants a completely different route.',
    shibaCallout: 'Bork!',
    animalCallout: 'Grrrr',
    personCallout: pickBigDogHandlerLine(ownerHeadwear),
    timeLeft: travelDistance / speed + 0.35,
    direction,
    speed,
    screenX: direction === 1 ? -180 : stageWidth + 180,
    switchIn: 0,
  };
}

function createEvent(stageWidth: number): ActiveEvent {
  const roll = Math.random();

  if (roll < 0.3) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 138;
    const travelDistance = stageWidth + 220;
    return {
      type: 'cat',
      catCoat: pickCatCoat(),
      label: direction === 1 ? 'A cat darts ahead' : 'A cat streaks back across the path',
      description: 'The shiba instantly decides the cat is the new plan.',
      timeLeft: travelDistance / speed + 0.2,
      direction,
      speed,
      screenX: direction === 1 ? -110 : stageWidth + 110,
      switchIn: 0,
    };
  }

  if (roll < 0.52) {
    return {
      type: 'rain',
      label: 'Rain starts',
      description: 'The weather turns and she would much rather retreat to familiar ground.',
      timeLeft: randomBetween(5.5, 7.5),
      direction: -1,
      speed: 0,
      screenX: 0,
      switchIn: 0,
    };
  }

  if (roll < 0.72) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 82;
    const travelDistance = stageWidth + 240;
    return {
      type: 'dog',
      dogCoat: pickRegularDogCoat(),
      label: 'A friendly dog stops by',
      description: 'The dog walks over to sniff hello, waits nearby, and then continues once the walk pulls away.',
      timeLeft: travelDistance / speed + 7.2,
      direction,
      speed,
      screenX: direction === 1 ? -120 : stageWidth + 120,
      switchIn: 0,
    };
  }

  if (roll < 0.88) {
    return createBigDogEvent(stageWidth);
  }

  return {
    type: 'stubborn',
    label: 'Stubborn streak',
    description: 'Her inner compass breaks and every impulse becomes random.',
    timeLeft: randomBetween(5.8, 7.3),
    direction: pickRandomDirection(),
    speed: randomBetween(18, 112),
    screenX: 0,
    switchIn: randomBetween(0.5, 1.15),
  };
}

function createSpecificEvent(type: 'cat' | 'dog' | 'bigDog', stageWidth: number): ActiveEvent {
  if (type === 'cat') {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 138;
    const travelDistance = stageWidth + 220;
    return {
      type: 'cat',
      catCoat: pickCatCoat(),
      label: direction === 1 ? 'A cat darts ahead' : 'A cat streaks back across the path',
      description: 'The shiba instantly decides the cat is the new plan.',
      timeLeft: travelDistance / speed + 0.2,
      direction,
      speed,
      screenX: direction === 1 ? -110 : stageWidth + 110,
      switchIn: 0,
    };
  }

  if (type === 'bigDog') {
    return createBigDogEvent(stageWidth);
  }

  const direction = Math.random() < 0.5 ? -1 : 1;
  const speed = 82;
  const travelDistance = stageWidth + 240;
  return {
    type: 'dog',
    dogCoat: pickRegularDogCoat(),
    label: 'A friendly dog stops by',
    description: 'The dog walks over to sniff hello, waits nearby, and then continues once the walk pulls away.',
    timeLeft: travelDistance / speed + 7.2,
    direction,
    speed,
    screenX: direction === 1 ? -120 : stageWidth + 120,
    switchIn: 0,
  };
}

export function createInitialState(_stageWidth = 960): GameState {
  const route = createRoutePlan();

  return {
    elapsed: 0,
    progress: 0,
    furthestProgress: 0,
    velocity: 0,
    walkerStridePhase: 0,
    shibaStridePhase: 0,
    animalStridePhase: 0,
    facing: 1,
    pullReserve: MAX_PULL_RESERVE,
    treats: 5,
    treatBoost: 0,
    treatVisualTimeLeft: 0,
    collectedTreats: [],
    levels: route.levels,
    worldProps: route.worldProps,
    mood: pickBaseMood(),
    moodTimeLeft: randomBetween(2.1, 4.4),
    activeEvent: null,
    nextEventIn: randomBetween(2.6, 5.1),
    screamTimeLeft: 0,
    lastCompletedLevelIndex: 0,
    levelCompleteTimeLeft: 0,
    won: false,
  };
}

export function useTreat(state: GameState): GameState {
  if (state.won || state.treats <= 0) {
    return state;
  }

  return {
    ...state,
    treats: state.treats - 1,
    treatBoost: TREAT_BOOST_DURATION,
    treatVisualTimeLeft: TREAT_VISUAL_DURATION,
  };
}

export function useScream(state: GameState): GameState {
  if (state.won) {
    return state;
  }

  return {
    ...state,
    screamTimeLeft: SCREAM_DURATION,
  };
}

export function spawnDebugEvent(
  state: GameState,
  stageWidth: number,
  type: 'cat' | 'dog' | 'bigDog',
): GameState {
  if (state.won) {
    return state;
  }

  return {
    ...state,
    activeEvent: createSpecificEvent(type, stageWidth),
    animalStridePhase: 0,
  };
}

function collectTreats(
  progress: number,
  worldProps: GameState['worldProps'],
  collectedTreats: string[],
  treats: number,
) {
  const nextCollected = [...collectedTreats];
  let nextTreats = treats;

  for (const prop of worldProps) {
    if (prop.kind !== 'treat' || nextCollected.includes(prop.id)) {
      continue;
    }

    if (Math.abs(progress - prop.x) < 34) {
      nextCollected.push(prop.id);
      nextTreats += 1;
    }
  }

  return {
    collectedTreats: nextCollected,
    treats: nextTreats,
  };
}

export function advanceGame(
  prev: GameState,
  dt: number,
  controls: { pullDirection: Direction; bracing: boolean },
  stageWidth: number,
): GameState {
  if (prev.won) {
    return prev;
  }

  const worldScale = clamp(stageWidth / 2500, 0.18, 0.42);

  let mood = prev.mood;
  let moodTimeLeft = prev.moodTimeLeft - dt;
  if (moodTimeLeft <= 0) {
    mood = pickBaseMood();
    moodTimeLeft = randomBetween(2.1, 4.4);
  }

  let nextEventIn = prev.nextEventIn - dt;
  const screamTimeLeft = Math.max(0, prev.screamTimeLeft - dt);
  let levelCompleteTimeLeft = Math.max(0, prev.levelCompleteTimeLeft - dt);
  let activeEvent = prev.activeEvent
    ? {
        ...prev.activeEvent,
        timeLeft: prev.activeEvent.timeLeft - dt,
      }
    : null;

  if (!activeEvent && nextEventIn <= 0) {
    activeEvent = createEvent(stageWidth);
    nextEventIn = randomBetween(4.2, 6.8);
  }

  if (activeEvent?.type === 'cat') {
    activeEvent = {
      ...activeEvent,
      screenX: activeEvent.screenX + activeEvent.speed * activeEvent.direction * dt,
    };
  }

  if (activeEvent?.type === 'bigDog') {
    activeEvent = {
      ...activeEvent,
      screenX: activeEvent.screenX + activeEvent.speed * activeEvent.direction * dt,
    };
  }

  if (activeEvent?.type === 'dog') {
    const shibaScreenX = getShibaScreenX(stageWidth);
    const shibaFacing = prev.facing || 1;
    const shibaNoseX =
      shibaScreenX + (shibaFacing === -1 ? -SHIBA_NOSE_OFFSET : SHIBA_NOSE_OFFSET);
    const dogFacingAtStop = shibaFacing === 1 ? -1 : 1;
    const dogNoseOffset = dogFacingAtStop === -1 ? -DOG_NOSE_OFFSET : DOG_NOSE_OFFSET;
    const stopX = shibaNoseX - dogNoseOffset;
    const cameraDrift = prev.velocity * worldScale * dt;
    const driftedScreenX = activeEvent.screenX - cameraDrift;
    const nextScreenX =
      driftedScreenX + activeEvent.speed * activeEvent.direction * dt;
    const hasPaused = activeEvent.switchIn < 0;
    const reachedStop =
      activeEvent.direction === 1 ? nextScreenX >= stopX : nextScreenX <= stopX;
    const waitLeft = activeEvent.switchIn - dt;

    if (activeEvent.speed > 1 && !hasPaused && reachedStop) {
      activeEvent = {
        ...activeEvent,
        screenX: stopX,
        speed: 0,
        timeLeft: Math.max(activeEvent.timeLeft, 5.1),
        switchIn: DOG_WAIT_DURATION,
      };
    } else if (activeEvent.speed <= 1 && waitLeft <= 0) {
      activeEvent = {
        ...activeEvent,
        screenX: driftedScreenX + DOG_RELEASE_SPEED * activeEvent.direction * dt,
        speed: DOG_RELEASE_SPEED,
        switchIn: -1,
      };
    } else if (activeEvent.speed <= 1) {
      activeEvent = {
        ...activeEvent,
        screenX: driftedScreenX,
        speed: 0,
        timeLeft: Math.max(activeEvent.timeLeft, 5.1),
        switchIn: waitLeft,
      };
    } else {
      activeEvent = {
        ...activeEvent,
        screenX: nextScreenX,
      };
    }
  }

  if (activeEvent?.type === 'stubborn') {
    const switchIn = activeEvent.switchIn - dt;
    activeEvent = {
      ...activeEvent,
      switchIn,
    };

    if (switchIn <= 0) {
      activeEvent = {
        ...activeEvent,
        direction: pickRandomDirection(),
        speed: randomBetween(18, 116),
        switchIn: randomBetween(0.45, 1.05),
      };
    }
  }

  if (activeEvent && activeEvent.timeLeft <= 0) {
    activeEvent = null;
    nextEventIn = randomBetween(3.4, 6.6);
  }

  const treatBoost = Math.max(0, prev.treatBoost - dt);
  const treatVisualTimeLeft = Math.max(0, prev.treatVisualTimeLeft - dt);
  const isPulling = controls.pullDirection !== 0;
  const pullReserve = clamp(
    prev.pullReserve +
      (
        isPulling
          ? -PULL_DRAIN_PER_SECOND
          : PULL_RECOVERY_PER_SECOND + (controls.bracing ? BRACE_RECOVERY_BONUS : 0)
      ) *
        dt,
    0,
    MAX_PULL_RESERVE,
  );
  const pullAssist = isPulling
    ? controls.pullDirection * 168 * (0.18 + 0.82 * (pullReserve / MAX_PULL_RESERVE))
    : 0;

  let targetVelocity = mood.direction * mood.speed;
  let movementMultiplier = 1;

  if (activeEvent?.type === 'cat') {
    const shibaScreenX = getShibaScreenX(stageWidth);
    const catOffset = activeEvent.screenX - shibaScreenX;
    const catChaseDirection = catOffset > 14 ? 1 : catOffset < -14 ? -1 : 0;
    targetVelocity += catChaseDirection * Math.max(74, activeEvent.speed);
  } else if (activeEvent?.type === 'bigDog') {
    const shibaScreenX = getShibaScreenX(stageWidth);
    const dogOffset = activeEvent.screenX - shibaScreenX;
    const distance = Math.abs(dogOffset);
    const avoidancePressure = clamp(1 - distance / 360, 0, 1);

    if (avoidancePressure > 0) {
      const avoidanceDirection = dogOffset >= 0 ? -1 : 1;
      targetVelocity += avoidanceDirection * (46 + avoidancePressure * 118);
      movementMultiplier = 0.72;
    }
  } else if (activeEvent?.type === 'rain') {
    targetVelocity += -102;
  } else if (activeEvent?.type === 'dog') {
    movementMultiplier = activeEvent.speed > 1 ? 0.24 : 0.08;
  } else if (activeEvent?.type === 'stubborn') {
    targetVelocity = activeEvent.direction * activeEvent.speed;
  }

  if (treatBoost > 0) {
    targetVelocity += 92;
  }

  targetVelocity += pullAssist;

  if (controls.bracing) {
    targetVelocity *= BRACE_DAMPING;
  }

  targetVelocity *= movementMultiplier;

  const ease = 1 - Math.exp(-dt * 5);
  const velocity = prev.velocity + (targetVelocity - prev.velocity) * ease;
  const unclampedProgress = prev.progress + velocity * dt;
  const routeLength = getRouteLength(prev.levels);
  const progress = clamp(unclampedProgress, 0, routeLength);
  const furthestProgress = Math.max(prev.furthestProgress, progress);
  const completedLevelIndex = getCompletedLevelIndex(furthestProgress, prev.levels);
  const lastCompletedLevelIndex =
    completedLevelIndex > prev.lastCompletedLevelIndex
      ? completedLevelIndex
      : prev.lastCompletedLevelIndex;

  if (completedLevelIndex > prev.lastCompletedLevelIndex) {
    levelCompleteTimeLeft = LEVEL_COMPLETE_DISPLAY_DURATION;
  }

  const pickupResult = collectTreats(
    progress,
    prev.worldProps,
    prev.collectedTreats,
    prev.treats,
  );
  const facing =
    targetVelocity > 12 ? 1 : targetVelocity < -12 ? -1 : prev.facing || 1;
  const won = progress >= routeLength;
  const movementSpeed = Math.abs(velocity);
  const walkerStridePhase = advanceStridePhase(
    prev.walkerStridePhase,
    movementSpeed,
    dt,
    16,
    0.74,
    1.26,
  );
  const shibaStridePhase = advanceStridePhase(
    prev.shibaStridePhase,
    movementSpeed,
    dt,
    14,
    0.82,
    1.44,
  );
  const animalSpeed =
    activeEvent?.type === 'cat'
      ? activeEvent.speed
      : activeEvent?.type === 'bigDog'
        ? activeEvent.speed
      : activeEvent?.type === 'dog' && activeEvent.speed > 1
        ? activeEvent.speed
        : 0;
  const animalStridePhase = activeEvent?.type === 'cat'
    ? advanceStridePhase(
        prev.activeEvent?.type === 'cat' ? prev.animalStridePhase : 0,
        animalSpeed,
        dt,
        18,
        1.18,
        1.86,
      )
    : activeEvent?.type === 'dog'
      ? advanceStridePhase(
          prev.activeEvent?.type === 'dog' ? prev.animalStridePhase : 0,
          animalSpeed,
          dt,
          14,
          0.94,
          1.32,
        )
      : activeEvent?.type === 'bigDog'
        ? advanceStridePhase(
            prev.activeEvent?.type === 'bigDog' ? prev.animalStridePhase : 0,
            animalSpeed,
            dt,
            14,
            0.92,
            1.26,
          )
      : 0;

  return {
    elapsed: prev.elapsed + dt,
    progress,
    furthestProgress,
    velocity: won ? 0 : velocity,
    walkerStridePhase,
    shibaStridePhase,
    animalStridePhase,
    facing,
    pullReserve,
    treats: pickupResult.treats,
    treatBoost,
    treatVisualTimeLeft,
    collectedTreats: pickupResult.collectedTreats,
    levels: prev.levels,
    worldProps: prev.worldProps,
    mood,
    moodTimeLeft,
    activeEvent,
    nextEventIn,
    screamTimeLeft,
    lastCompletedLevelIndex,
    levelCompleteTimeLeft,
    won,
  };
}

export function getMoodSummary(state: GameState): MoodSummary {
  const level = getLevelForProgress(state.progress, state.levels);
  const finalLevel = state.levels[state.levels.length - 1];

  if (state.won) {
    return {
      title: `${finalLevel.destinationLabel} reached`,
      body: `The walk keeps rolling and finally settles in at the ${finalLevel.destinationLabel.toLowerCase()}.`,
    };
  }

  if (state.activeEvent) {
    return {
      title: state.activeEvent.label,
      body: state.activeEvent.description,
    };
  }

  if (state.treatBoost > 0) {
    return {
      title: 'Treat focus',
      body: 'She has locked onto the reward and is much more willing to move forward.',
    };
  }

  if (level.index > 1 && state.progress < level.startProgress + 180) {
    return {
      title: `Level ${level.index} begins`,
      body: `${level.startLabel} slips behind you and the walk continues toward ${level.destinationLabel}.`,
    };
  }

  return {
    title: state.mood.label,
    body: state.mood.description,
  };
}
