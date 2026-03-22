import type { ActiveEvent, Direction, GameState, IntentProfile, MoodSummary } from './types';
import {
  LEVEL_LENGTH,
  LEVEL_ONE_END,
  LEVEL_TWO_END,
  PLAYER_SCREEN_RATIO,
  WORLD_PROPS,
  getLevelForProgress,
} from './world';

const MAX_PULL_RESERVE = 100;
const PULL_DRAIN_PER_SECOND = 34;
const PULL_RECOVERY_PER_SECOND = 24;
const BRACE_RECOVERY_BONUS = 16;
const BRACE_DAMPING = 0.58;
const TREAT_BOOST_DURATION = 4.8;
export const TREAT_VISUAL_DURATION = 0.9;
const SCREAM_DURATION = 1.2;
const SHIBA_NOSE_OFFSET = 42;
const DOG_NOSE_OFFSET = 96;
const DOG_WAIT_DURATION = 2;
const DOG_RELEASE_SPEED = 94;

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

function createEvent(stageWidth: number): ActiveEvent {
  const roll = Math.random();

  if (roll < 0.33) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 138;
    const travelDistance = stageWidth + 220;
    return {
      type: 'cat',
      label: direction === 1 ? 'A cat darts ahead' : 'A cat streaks back across the path',
      description: 'The shiba instantly decides the cat is the new plan.',
      timeLeft: travelDistance / speed + 0.2,
      direction,
      speed,
      screenX: direction === 1 ? -110 : stageWidth + 110,
      switchIn: 0,
    };
  }

  if (roll < 0.56) {
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

  if (roll < 0.78) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 82;
    const travelDistance = stageWidth + 240;
    return {
      type: 'dog',
      label: 'A friendly dog stops by',
      description: 'The dog walks over to sniff hello, waits nearby, and then continues once the walk pulls away.',
      timeLeft: travelDistance / speed + 7.2,
      direction,
      speed,
      screenX: direction === 1 ? -120 : stageWidth + 120,
      switchIn: 0,
    };
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

export function createInitialState(stageWidth = 960): GameState {
  return {
    elapsed: 0,
    progress: 0,
    furthestProgress: 0,
    velocity: 0,
    facing: 1,
    pullReserve: MAX_PULL_RESERVE,
    treats: 5,
    treatBoost: 0,
    treatVisualTimeLeft: 0,
    collectedTreats: [],
    mood: pickBaseMood(),
    moodTimeLeft: randomBetween(2.1, 4.4),
    activeEvent: null,
    nextEventIn: randomBetween(2.6, 5.1),
    screamTimeLeft: 0,
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

function collectTreats(progress: number, collectedTreats: string[], treats: number) {
  const nextCollected = [...collectedTreats];
  let nextTreats = treats;

  for (const prop of WORLD_PROPS) {
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
  const progress = clamp(unclampedProgress, 0, LEVEL_LENGTH);
  const furthestProgress = Math.max(prev.furthestProgress, progress);

  const pickupResult = collectTreats(progress, prev.collectedTreats, prev.treats);
  const facing =
    targetVelocity > 12 ? 1 : targetVelocity < -12 ? -1 : prev.facing || 1;
  const won = progress >= LEVEL_LENGTH;

  return {
    elapsed: prev.elapsed + dt,
    progress,
    furthestProgress,
    velocity: won ? 0 : velocity,
    facing,
    pullReserve,
    treats: pickupResult.treats,
    treatBoost,
    treatVisualTimeLeft,
    collectedTreats: pickupResult.collectedTreats,
    mood,
    moodTimeLeft,
    activeEvent,
    nextEventIn,
    screamTimeLeft,
    won,
  };
}

export function getMoodSummary(state: GameState): MoodSummary {
  const level = getLevelForProgress(state.progress);

  if (state.won) {
    return {
      title: 'Post office reached',
      body: 'Coffee in hand, the walk finishes at the post office and the parcel is finally picked up.',
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

  if (level.index === 2 && state.progress < LEVEL_ONE_END + 180) {
    return {
      title: 'Level 2 begins',
      body: 'The park slips behind you and the walk rolls straight on toward the cafe.',
    };
  }

  if (level.index === 3 && state.progress < LEVEL_TWO_END + 180) {
    return {
      title: 'Level 3 begins',
      body: 'You pass the cafe, pick up a coffee, and keep walking toward the post office.',
    };
  }

  return {
    title: state.mood.label,
    body: state.mood.description,
  };
}
