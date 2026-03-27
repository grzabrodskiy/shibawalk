import type { Graphics } from 'pixi.js';
import type { Direction } from '../game';

const WALKER_HAND_LOCAL = { x: 81, y: -161 };
const SHIBA_COLLAR_LOCAL = { x: 30, y: -86 };
const SHIBA_PULL_BACK_COLLAR_LOCAL = { x: 14, y: -80 };
const SHIBA_HEAD_TOP_Y = -140;
const SHIBA_PULL_BACK_HEAD_TOP_Y = -148;

export interface WalkerSceneModel {
  x: number;
  groundY: number;
  facing: Direction;
  stridePhase: number;
  gait: number;
  rainy: boolean;
  hasCoffeeCup: boolean;
  hasParcel: boolean;
}

export interface ShibaSceneModel {
  x: number;
  groundY: number;
  facing: Direction;
  stridePhase: number;
  gait: number;
  rainy: boolean;
  pullBack?: boolean;
}

export interface EventAnimalSceneModel {
  type: 'cat' | 'dog';
  x: number;
  groundY: number;
  facing: Direction;
  stridePhase: number;
  gait: number;
  sniffing: boolean;
}

export interface ActorSceneModel {
  walker: WalkerSceneModel;
  shiba: ShibaSceneModel;
  eventAnimal: EventAnimalSceneModel | null;
  isPulling: boolean;
  renderWalker?: boolean;
  renderShiba?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export function resolveFacing(facing: Direction) {
  return facing === -1 ? -1 : 1;
}

export function point(x: number, y: number): Point {
  return { x, y };
}

export function localPoint(
  x: number,
  groundY: number,
  localX: number,
  localY: number,
  facing: number,
  bob = 0,
) {
  return point(x + localX * facing, groundY + localY + bob);
}

export function limbStroke(
  graphics: Graphics,
  points: Point[],
  color: number,
  width: number,
  alpha = 1,
) {
  if (points.length < 2) {
    return;
  }

  graphics.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    graphics.lineTo(points[index].x, points[index].y);
  }
  graphics.stroke({
    color,
    width,
    alpha,
    cap: 'round',
    join: 'round',
  });
}

export function getWalkerBob(model: WalkerSceneModel) {
  return Math.sin(model.stridePhase * 2) * 2.8 * model.gait;
}

export function getShibaBob(model: ShibaSceneModel) {
  return Math.sin(model.stridePhase * 2) * 2.2 * model.gait;
}

export function getWalkerHandAnchor(model: WalkerSceneModel) {
  const facing = resolveFacing(model.facing);
  return localPoint(
    model.x,
    model.groundY,
    WALKER_HAND_LOCAL.x,
    WALKER_HAND_LOCAL.y,
    facing,
    getWalkerBob(model),
  );
}

export function getShibaCollarAnchor(model: ShibaSceneModel) {
  const facing = resolveFacing(model.facing);
  const collarLocal = model.pullBack ? SHIBA_PULL_BACK_COLLAR_LOCAL : SHIBA_COLLAR_LOCAL;
  return localPoint(
    model.x,
    model.groundY,
    collarLocal.x,
    collarLocal.y,
    facing,
    getShibaBob(model),
  );
}

export function getShibaBubblePosition(model: ShibaSceneModel) {
  const facing = resolveFacing(model.facing);
  const collarLocal = model.pullBack ? SHIBA_PULL_BACK_COLLAR_LOCAL : SHIBA_COLLAR_LOCAL;
  const headTopY = model.pullBack ? SHIBA_PULL_BACK_HEAD_TOP_Y : SHIBA_HEAD_TOP_Y;
  return localPoint(
    model.x,
    model.groundY,
    collarLocal.x + 12,
    headTopY,
    facing,
    getShibaBob(model),
  );
}
