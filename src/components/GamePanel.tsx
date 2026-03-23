import { CSSProperties, type RefObject, useMemo } from 'react';
import { ShibaArt, WalkerArt } from '../art';
import {
  PLAYER_SCREEN_RATIO,
  TREAT_VISUAL_DURATION,
  getDestinationProgress,
} from '../game';
import type { Direction, GameState, LevelDefinition, MoodSummary } from '../game';
import { EventActor, getAnimalEncounterState } from './EventActor';
import { StageStats } from './StageStats';
import { StatusPanel } from './StatusPanel';
import { WorldObject } from './WorldObject';

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

function resolveAnchorX(
  localX: number,
  viewBoxWidth: number,
  renderWidth: number,
  facing: number,
  naturalFacing: number,
) {
  const mirrored = facing !== naturalFacing;
  const ratio = localX / viewBoxWidth;
  return renderWidth * (mirrored ? 1 - ratio : ratio);
}

function resolveAnchorY(localY: number, viewBoxHeight: number, renderHeight: number) {
  return renderHeight * (localY / viewBoxHeight);
}

const WALKER_LEASH_HAND = { x: 182, y: 206 };
const SHIBA_COLLAR_ANCHOR = { x: 132, y: 97 };
const SHIBA_TREAT_TARGET = { x: 34, y: 90 };

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
  onReset: () => void;
  stageRef: RefObject<HTMLDivElement>;
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
  onReset,
  stageRef,
  stageWidth,
  stageHeight,
}: GamePanelProps) {
  const worldScale = clamp(stageWidth / 2500, 0.18, 0.42);
  const playerX = clamp(stageWidth * PLAYER_SCREEN_RATIO, 96, 250);
  const shibaX = playerX + clamp(stageWidth * 0.16, 88, 170);
  const walkerWidth = 220;
  const walkerHeight = (walkerWidth * 360) / 210;
  const walkerBottom = 90;
  const walkerLeft = playerX - walkerWidth / 2;
  const walkerTop = stageHeight - walkerBottom - walkerHeight;
  const shibaWidth = 250;
  const shibaHeight = (shibaWidth * 200) / 280;
  const shibaBottom = 94;
  const shibaLeft = shibaX - shibaWidth / 2;
  const shibaTop = stageHeight - shibaBottom - shibaHeight;
  const visualSpeed = Math.min(Math.abs(game.velocity), 88);
  const gaitBand = getGaitBand(visualSpeed);
  const walkerStride = ['2.18s', '1.98s', '1.84s', '1.7s'][gaitBand];
  const shibaStride = ['2.02s', '1.84s', '1.7s', '1.56s'][gaitBand];
  const walkerMoving = visualSpeed > 20;
  const shibaMoving = visualSpeed > 18;
  const cafeProgress = getDestinationProgress(game.levels, 'cafe');
  const postOfficeProgress = getDestinationProgress(game.levels, 'postOffice');
  const hasParcel =
    postOfficeProgress !== null && game.furthestProgress >= postOfficeProgress;
  const hasCoffeeCup =
    !hasParcel && cafeProgress !== null && game.furthestProgress >= cafeProgress;
  const travelFacing = Math.abs(game.velocity) > 8 ? (game.velocity > 0 ? 1 : -1) : game.facing;
  const walkerFacing = travelFacing;
  const shibaFacing = travelFacing;
  const leashHandX =
    walkerLeft + resolveAnchorX(WALKER_LEASH_HAND.x, 210, walkerWidth, walkerFacing, 1);
  const leashHandY = walkerTop + resolveAnchorY(WALKER_LEASH_HAND.y, 360, walkerHeight);
  const leashHandControlX = leashHandX + walkerFacing * 18;
  const leashDogX =
    shibaLeft + resolveAnchorX(SHIBA_COLLAR_ANCHOR.x, 280, shibaWidth, shibaFacing, -1);
  const leashDogY = shibaTop + resolveAnchorY(SHIBA_COLLAR_ANCHOR.y, 200, shibaHeight);
  const treatProgress = clamp(1 - treatVisualTimeLeft / TREAT_VISUAL_DURATION, 0, 1);
  const treatArc = Math.sin(treatProgress * Math.PI) * 28;
  const treatStartX = leashHandX + walkerFacing * 8;
  const treatStartY = leashHandY - 8;
  const treatTargetX =
    shibaLeft + resolveAnchorX(SHIBA_TREAT_TARGET.x, 280, shibaWidth, shibaFacing, -1);
  const treatTargetY =
    shibaTop + resolveAnchorY(SHIBA_TREAT_TARGET.y, 200, shibaHeight);
  const treatX = treatStartX + (treatTargetX - treatStartX) * treatProgress;
  const treatY = treatStartY + (treatTargetY - treatStartY) * treatProgress - treatArc;
  const stageStyle = {
    ['--camera' as string]: `${game.progress}px`,
    ['--road-shift' as string]: `${-game.progress * 2.1}px`,
    ['--cloud-shift' as string]: `${-game.progress * 0.18}px`,
    ['--hill-shift' as string]: `${-game.progress * 0.11}px`,
    ['--tree-shift' as string]: `${-game.progress * 0.43}px`,
  } as CSSProperties;
  const animalEncounter = getAnimalEncounterState(game.activeEvent, stageWidth, shibaX);
  const showReactionScream = Boolean(animalEncounter?.showCallout);

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
        style={stageStyle}
      >
        <div className="stage__sky" />
        <div className="stage__hills" />
        <div className="stage__houses" />
        <div className="stage__road" />
        <div className="stage__curb" />
        <div className="stage__grass" />

        <div className="cloud cloud--1" />
        <div className="cloud cloud--2" />
        <div className="cloud cloud--3" />

        <StageStats
          level={routeLevel}
          pullReserve={pullReserve}
          treats={treats}
          screamTimeLeft={screamTimeLeft}
          progressPct={levelProgressPct}
          distanceToGoal={distanceToGoal}
        />

        {visibleProps.map(({ prop, x, collected }) => (
          <WorldObject key={prop.id} prop={prop} x={x} collected={collected} />
        ))}

        <EventActor event={game.activeEvent} stageWidth={stageWidth} shibaX={shibaX} />

        {game.activeEvent?.type === 'rain' && (
          <>
            <div className="rain-overlay rain-overlay--back" />
            <div className="rain-overlay rain-overlay--front" />
          </>
        )}

        <svg
          className="leash-overlay"
          viewBox={`0 0 ${Math.max(stageWidth, 960)} ${Math.max(stageHeight, 620)}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={`M ${leashHandX} ${leashHandY} C ${leashHandControlX} ${isPulling ? leashHandY - 10 : leashHandY + 14}, ${leashDogX - 28} ${isPulling ? leashDogY - 18 : leashDogY + 8}, ${leashDogX} ${leashDogY}`}
            fill="none"
            stroke={isPulling ? '#cb6a2d' : '#6d513c'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>

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
            hasCoffeeCup={hasCoffeeCup}
            hasParcel={hasParcel}
          />
        </div>

        <div className="character character--shiba" style={{ left: `${shibaX}px` }}>
          <ShibaArt
            facing={shibaFacing}
            moving={shibaMoving}
            rainy={game.activeEvent?.type === 'rain'}
            stride={shibaStride}
          />
        </div>

        {(screamTimeLeft > 0 || showReactionScream) && (
          <div className="shiba-scream-bubble" style={{ left: `${shibaX + 8}px`, top: `${shibaTop - 30}px` }}>
            YIP!
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
        onReset={onReset}
      />
    </section>
  );
}
