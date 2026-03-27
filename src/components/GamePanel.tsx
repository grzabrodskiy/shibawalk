import { type RefObject, useMemo } from 'react';
import { ShibaArt, WalkerArt } from '../art';
import {
  PLAYER_SCREEN_RATIO,
  TREAT_VISUAL_DURATION,
  getCarriedItemForDestination,
} from '../game';
import type { Direction, GameState, LevelDefinition, MoodSummary } from '../game';
import { EventActor, getAnimalEncounterState } from './EventActor';
import { PixiStageScene } from './PixiStageScene';
import {
  getShibaBubblePosition,
  getShibaCollarAnchor,
  getWalkerHandAnchor,
} from './pixiActors';
import { StageStats } from './StageStats';
import { StatusPanel } from './StatusPanel';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getGaitBand(speed: number) {
  if (speed > 72) {
    return 3;
  }
  if (speed > 48) {
    return 2;
  }
  if (speed > 24) {
    return 1;
  }
  return 0;
}

function getCarriedItemLabel(destinationKey: LevelDefinition['destinationKey']) {
  switch (destinationKey) {
    case 'park':
      return 'Flowers picked up';
    case 'cafe':
      return 'Coffee secured';
    case 'postOffice':
      return 'Parcel in hand';
    case 'restaurant':
      return 'Takeout acquired';
    case 'petStore':
      return 'Pet store bag ready';
    case 'home':
    default:
      return '';
  }
}

function isStubbornStreak(game: GameState, moodSummary: MoodSummary) {
  return (
    game.activeEvent?.type === 'stubborn' ||
    moodSummary.title === 'Stubborn streak' ||
    game.mood.label === 'Stubborn streak'
  );
}

interface GamePanelProps {
  game: GameState;
  isPulling: boolean;
  pullDirection: Direction;
  isBracing: boolean;
  moodSummary: MoodSummary;
  pullReserve: number;
  treats: number;
  screamTimeLeft: number;
  routeLevel: LevelDefinition;
  levelProgressPct: number;
  distanceToGoal: string;
  treatVisualTimeLeft: number;
  onPullStart: (direction: Direction) => void;
  onPullEnd: () => void;
  onTreat: () => void;
  onScream: () => void;
  onSpawnCat: () => void;
  onSpawnDog: () => void;
  onSpawnBigDog: () => void;
  onReset: () => void;
  stageRef: RefObject<HTMLDivElement | null>;
  stageWidth: number;
  stageHeight: number;
}

export function GamePanel({
  game,
  isPulling,
  pullDirection,
  isBracing,
  moodSummary,
  pullReserve,
  treats,
  screamTimeLeft,
  routeLevel,
  levelProgressPct,
  distanceToGoal,
  treatVisualTimeLeft,
  onPullStart,
  onPullEnd,
  onTreat,
  onScream,
  onSpawnCat,
  onSpawnDog,
  onSpawnBigDog,
  onReset,
  stageRef,
  stageWidth,
  stageHeight,
}: GamePanelProps) {
  const shibaPullBack = isStubbornStreak(game, moodSummary);
  const worldScale = clamp(stageWidth / 2500, 0.18, 0.42);
  const playerX = clamp(stageWidth * PLAYER_SCREEN_RATIO, 96, 250);
  const shibaX = playerX + clamp(stageWidth * 0.16, 88, 170);
  const walkerGroundY = stageHeight - 90;
  const shibaGroundY = stageHeight - 94;
  const visualSpeed = Math.min(Math.abs(game.velocity), 88);
  const gaitBand = getGaitBand(visualSpeed);
  const walkerStride = ['2.18s', '1.98s', '1.84s', '1.7s'][gaitBand];
  const shibaStride = ['2.02s', '1.82s', '1.66s', '1.52s'][gaitBand];
  const walkerMoving = visualSpeed > 16;
  const shibaMoving = visualSpeed > 14;
  const walkerGait = clamp((visualSpeed - 12) / 68, 0, 1);
  const shibaGait = clamp((visualSpeed - 10) / 70, 0, 1);
  const shibaSceneGait = shibaPullBack ? 0 : shibaGait;
  const completedLevel =
    game.lastCompletedLevelIndex > 0 ? game.levels[game.lastCompletedLevelIndex - 1] : null;
  const carriedItem = getCarriedItemForDestination(completedLevel?.destinationKey);
  const hasParcel = carriedItem === 'parcel';
  const hasCoffeeCup = carriedItem === 'coffee';
  const travelFacing = Math.abs(game.velocity) > 8 ? (game.velocity > 0 ? 1 : -1) : game.facing;
  const walkerFacing = travelFacing;
  const shibaFacing = travelFacing;
  const walkerScene = {
    x: playerX,
    groundY: walkerGroundY,
    facing: walkerFacing,
    stridePhase: game.walkerStridePhase,
    gait: walkerGait,
    rainy: game.activeEvent?.type === 'rain',
    hasCoffeeCup,
    hasParcel,
  } as const;
  const shibaScene = {
    x: shibaX,
    groundY: shibaGroundY,
    facing: shibaFacing,
    stridePhase: game.shibaStridePhase,
    gait: shibaSceneGait,
    rainy: game.activeEvent?.type === 'rain',
    pullBack: shibaPullBack,
  } as const;
  const leashHand = getWalkerHandAnchor(walkerScene);
  const leashCollar = getShibaCollarAnchor(shibaScene);
  const treatProgress = clamp(1 - treatVisualTimeLeft / TREAT_VISUAL_DURATION, 0, 1);
  const treatArc = Math.sin(treatProgress * Math.PI) * 28;
  const treatStartX = leashHand.x + walkerFacing * 8;
  const treatStartY = leashHand.y - 8;
  const treatTargetX = leashCollar.x + shibaFacing * 36;
  const treatTargetY = leashCollar.y - 8;
  const treatX = treatStartX + (treatTargetX - treatStartX) * treatProgress;
  const treatY = treatStartY + (treatTargetY - treatStartY) * treatProgress - treatArc;
  const animalEncounter = getAnimalEncounterState(game.activeEvent, stageWidth, shibaX);
  const shibaReactionCallout = screamTimeLeft > 0 ? 'YIP!' : animalEncounter?.shibaCallout ?? null;
  const shibaBubble = getShibaBubblePosition(shibaScene);
  const actorScene = {
    walker: walkerScene,
    shiba: shibaScene,
    eventAnimal: null,
    isPulling,
    renderWalker: false,
    renderShiba: false,
  };

  const visibleProps = useMemo(
    () =>
      game.worldProps.map((prop) => ({
        prop,
        x: playerX + (prop.x - game.progress) * worldScale,
        collected: game.collectedTreats.includes(prop.id),
      })).filter(({ prop, x, collected }) => {
        if (prop.kind === 'treat' && collected) {
          return false;
        }

        return x > -200 && x < stageWidth + 220;
      }),
    [game.collectedTreats, game.progress, game.worldProps, playerX, stageWidth, worldScale],
  );

  return (
    <section className="game-panel">
      <div
        ref={stageRef}
        className={`stage${game.activeEvent?.type === 'rain' ? ' is-raining' : ''}${game.won ? ' is-won' : ''}`}
      >
        <PixiStageScene
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          progress={game.progress}
          elapsed={game.elapsed}
          velocity={game.velocity}
          activeLevel={routeLevel}
          isRaining={game.activeEvent?.type === 'rain'}
          visibleProps={visibleProps}
          actorScene={actorScene}
        />

        <StageStats
          level={routeLevel}
          pullReserve={pullReserve}
          treats={treats}
          screamTimeLeft={screamTimeLeft}
          progressPct={levelProgressPct}
          distanceToGoal={distanceToGoal}
        />

        {game.activeEvent?.type === 'rain' && (
          <>
            <div className="rain-overlay rain-overlay--back" />
            <div className="rain-overlay rain-overlay--front" />
          </>
        )}

        {game.levelCompleteTimeLeft > 0 && completedLevel && (
          <div className="stage-level-complete" aria-live="polite">
            <div className="stage-level-complete__card">
              <span className="stage-level-complete__eyebrow">
                Level {completedLevel.index} Complete
              </span>
              <strong>{completedLevel.destinationLabel} reached</strong>
              <span className="stage-level-complete__subline">
                {getCarriedItemLabel(completedLevel.destinationKey)}
              </span>
            </div>
          </div>
        )}

        {treatVisualTimeLeft > 0 && (
          <div
            className="treat-visual"
            style={{
              left: `${treatX}px`,
              top: `${treatY}px`,
              transform: `translate(-50%, -50%) rotate(${treatProgress * 220 - 40}deg)`,
            }}
            aria-hidden="true"
          />
        )}

        <div className="character character--walker" style={{ left: `${playerX}px` }}>
          <WalkerArt
            facing={walkerFacing}
            moving={walkerMoving}
            rainy={game.activeEvent?.type === 'rain'}
            stride={walkerStride}
            carriedItem={carriedItem}
          />
        </div>

        <div className="character character--shiba" style={{ left: `${shibaX}px` }}>
          <ShibaArt
            facing={shibaFacing}
            moving={shibaMoving && !shibaPullBack}
            pullBack={shibaPullBack}
            rainy={game.activeEvent?.type === 'rain'}
            stride={shibaStride}
          />
        </div>

        <EventActor event={game.activeEvent} stageWidth={stageWidth} shibaX={shibaX} />

        {shibaReactionCallout && (
          <div
            className="shiba-scream-bubble"
            style={{ left: `${shibaBubble.x}px`, top: `${shibaBubble.y}px` }}
          >
            {shibaReactionCallout}
          </div>
        )}

        <div className="stage-banner stage-banner--left">
          <span>{routeLevel.startLabel}</span>
        </div>
        <div className="stage-banner stage-banner--right">
          <span>{routeLevel.destinationLabel}</span>
        </div>
      </div>

      <StatusPanel
        moodSummary={moodSummary}
        screamTimeLeft={screamTimeLeft}
        pullDirection={pullDirection}
        isBracing={isBracing}
        onPullStart={onPullStart}
        onPullEnd={onPullEnd}
        onTreat={onTreat}
        onScream={onScream}
        onSpawnCat={onSpawnCat}
        onSpawnDog={onSpawnDog}
        onSpawnBigDog={onSpawnBigDog}
        onReset={onReset}
      />
    </section>
  );
}
