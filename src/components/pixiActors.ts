import type { Graphics } from 'pixi.js';
import { drawCat, drawDog } from './pixiAnimalActors';
import { drawShiba } from './pixiShibaActor';
import {
  getShibaCollarAnchor,
  getWalkerBob,
  getWalkerHandAnchor,
  limbStroke,
  localPoint,
  point,
  resolveFacing,
} from './pixiSceneModels';
import type {
  ActorSceneModel,
  ShibaSceneModel,
  WalkerSceneModel,
} from './pixiSceneModels';

function drawWalkerLeg(
  graphics: Graphics,
  model: WalkerSceneModel,
  hipLocalX: number,
  phaseOffset: number,
  colors: { upper: number; lower: number; boot: number },
  alpha: number,
) {
  const facing = resolveFacing(model.facing);
  const bob = getWalkerBob(model);
  const phase = model.stridePhase + phaseOffset;
  const swing = Math.sin(phase) * 18 * model.gait;
  const lift = Math.max(0, Math.cos(phase)) * 8 * model.gait;
  const hip = localPoint(model.x, model.groundY, hipLocalX, -104, facing, bob);
  const knee = point(hip.x + swing * facing * 0.76, hip.y + 50 - lift * 0.2);
  const ankle = point(knee.x + swing * facing * 0.48, knee.y + 54 - lift);

  limbStroke(graphics, [hip, knee], colors.upper, 18, alpha);
  limbStroke(graphics, [knee, ankle], colors.lower, 16, alpha);
  graphics.circle(hip.x, hip.y, 7).fill({ color: colors.upper, alpha });
  graphics.circle(knee.x, knee.y, 6).fill({ color: colors.lower, alpha });
  graphics.ellipse(ankle.x + facing * 12, ankle.y + 4, 17, 8).fill({
    color: colors.boot,
    alpha,
  });
}

function drawWalkerArm(
  graphics: Graphics,
  model: WalkerSceneModel,
  shoulderLocalX: number,
  shoulderLocalY: number,
  handLocalX: number,
  handLocalY: number,
  phaseOffset: number,
  alpha: number,
) {
  const facing = resolveFacing(model.facing);
  const bob = getWalkerBob(model);
  const phase = model.stridePhase + phaseOffset;
  const sway = Math.sin(phase) * 12 * model.gait;
  const shoulder = localPoint(model.x, model.groundY, shoulderLocalX, shoulderLocalY, facing, bob);
  const elbow = point(
    shoulder.x + (handLocalX - shoulderLocalX) * 0.56 * facing + sway * 0.36 * facing,
    shoulder.y + (handLocalY - shoulderLocalY) * 0.48 + 8,
  );
  const hand = localPoint(
    model.x,
    model.groundY,
    handLocalX + sway * 0.18,
    handLocalY + Math.abs(sway) * 0.08,
    facing,
    bob,
  );

  limbStroke(graphics, [shoulder, elbow], 0x334861, 14, alpha);
  limbStroke(graphics, [elbow, hand], 0x2d3f56, 12, alpha);
  graphics.circle(hand.x, hand.y, 6.2).fill({ color: 0xe0ab91, alpha });

  return hand;
}

function drawWalker(graphics: Graphics, model: WalkerSceneModel) {
  const facing = resolveFacing(model.facing);
  const bob = getWalkerBob(model);
  const coatColor = model.rainy ? 0x294259 : 0x31506a;
  const coatShade = model.rainy ? 0x1a2f43 : 0x21384e;
  const scarfColor = model.rainy ? 0xc67c4c : 0xe0a162;

  graphics.ellipse(model.x + 6, model.groundY - 6, 44, 10).fill({
    color: 0x1f1814,
    alpha: 0.16,
  });

  drawWalkerLeg(
    graphics,
    model,
    -12,
    Math.PI,
    { upper: 0x2d4257, lower: 0x25364a, boot: 0x1f1a17 },
    0.84,
  );
  drawWalkerLeg(
    graphics,
    model,
    16,
    0,
    { upper: 0x42586f, lower: 0x30475b, boot: 0x1f1a17 },
    1,
  );

  const rearHand = drawWalkerArm(graphics, model, -18, -182, -48, -140, Math.PI, 0.82);

  graphics.poly(
    [
      localPoint(model.x, model.groundY, -42, -206, facing, bob),
      localPoint(model.x, model.groundY, -8, -214, facing, bob),
      localPoint(model.x, model.groundY, 28, -206, facing, bob),
      localPoint(model.x, model.groundY, 50, -178, facing, bob),
      localPoint(model.x, model.groundY, 44, -124, facing, bob),
      localPoint(model.x, model.groundY, 24, -86, facing, bob),
      localPoint(model.x, model.groundY, -8, -76, facing, bob),
      localPoint(model.x, model.groundY, -40, -88, facing, bob),
      localPoint(model.x, model.groundY, -48, -144, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: coatColor });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, -34, -198, facing, bob),
      localPoint(model.x, model.groundY, 12, -202, facing, bob),
      localPoint(model.x, model.groundY, 32, -178, facing, bob),
      localPoint(model.x, model.groundY, 8, -170, facing, bob),
      localPoint(model.x, model.groundY, -24, -176, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: 0x5e7c96, alpha: 0.28 });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, -34, -202, facing, bob),
      localPoint(model.x, model.groundY, -6, -214, facing, bob),
      localPoint(model.x, model.groundY, 24, -208, facing, bob),
      localPoint(model.x, model.groundY, 12, -186, facing, bob),
      localPoint(model.x, model.groundY, -28, -188, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: scarfColor, alpha: 0.94 });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, -42, -98, facing, bob),
      localPoint(model.x, model.groundY, 32, -92, facing, bob),
      localPoint(model.x, model.groundY, 14, -76, facing, bob),
      localPoint(model.x, model.groundY, -28, -82, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: coatShade, alpha: 0.9 });

  const headCenter = localPoint(model.x, model.groundY, 8, -246, facing, bob);
  graphics.ellipse(headCenter.x, headCenter.y, 31, 35).fill({ color: 0xe7b99e });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, -18, -280, facing, bob),
      localPoint(model.x, model.groundY, 18, -286, facing, bob),
      localPoint(model.x, model.groundY, 44, -270, facing, bob),
      localPoint(model.x, model.groundY, 46, -234, facing, bob),
      localPoint(model.x, model.groundY, 24, -204, facing, bob),
      localPoint(model.x, model.groundY, -4, -210, facing, bob),
      localPoint(model.x, model.groundY, -22, -236, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: 0xa55321 });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, -10, -270, facing, bob),
      localPoint(model.x, model.groundY, 18, -278, facing, bob),
      localPoint(model.x, model.groundY, 34, -258, facing, bob),
      localPoint(model.x, model.groundY, 6, -250, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: 0xc96e2c, alpha: 0.42 });
  graphics.circle(headCenter.x + facing * 10, headCenter.y - 2, 3.4).fill({ color: 0x27211e });
  graphics.circle(headCenter.x - facing * 8, headCenter.y - 1, 3.2).fill({
    color: 0x27211e,
    alpha: 0.85,
  });
  limbStroke(
    graphics,
    [
      point(headCenter.x - facing * 4, headCenter.y + 12),
      point(headCenter.x + facing * 10, headCenter.y + 14),
    ],
    0xaf755d,
    3,
    0.85,
  );

  const frontHand = drawWalkerArm(graphics, model, 18, -180, 52, -136, 0, 1);

  if (model.hasCoffeeCup) {
    graphics.roundRect(rearHand.x - 10, rearHand.y - 20, 18, 24, 5).fill({ color: 0xd8c2a9 });
    graphics.roundRect(rearHand.x - 9, rearHand.y - 23, 16, 6, 4).fill({ color: 0xf5eee6 });
    graphics
      .moveTo(rearHand.x + 8, rearHand.y - 13)
      .arc(rearHand.x + 8, rearHand.y - 7, 6, -Math.PI / 2, Math.PI / 2)
      .stroke({
        color: 0xd8c2a9,
        width: 3,
      });
    graphics.moveTo(rearHand.x - 7, rearHand.y - 12).lineTo(rearHand.x + 6, rearHand.y - 12).stroke({
      color: 0xab7642,
      width: 3,
      cap: 'round',
    });
  }

  if (model.hasParcel) {
    graphics.roundRect(rearHand.x - 18, rearHand.y - 16, 30, 22, 4).fill({ color: 0xd3ad76 });
    graphics.moveTo(rearHand.x - 3, rearHand.y - 16)
      .lineTo(rearHand.x - 3, rearHand.y + 6)
      .stroke({ color: 0x9d6637, width: 3, cap: 'round' });
    graphics.moveTo(rearHand.x - 18, rearHand.y - 5)
      .lineTo(rearHand.x + 12, rearHand.y - 5)
      .stroke({ color: 0x9d6637, width: 2.5, cap: 'round' });
  }

  graphics.circle(frontHand.x, frontHand.y, 3.2).fill({ color: 0xd98a59, alpha: 0.9 });
}

function drawLeash(
  graphics: Graphics,
  walker: WalkerSceneModel,
  shiba: ShibaSceneModel,
  isPulling: boolean,
) {
  const hand = getWalkerHandAnchor(walker);
  const collar = getShibaCollarAnchor(shiba);
  const leashDirection = collar.x >= hand.x ? 1 : -1;
  const isTaut = isPulling || Boolean(shiba.pullBack);
  const handLift = isTaut ? -10 : 12;
  const collarLift = isTaut ? -18 : 6;
  const leashMidPull = shiba.pullBack ? 22 : 32;

  graphics
    .moveTo(hand.x, hand.y)
    .bezierCurveTo(
      hand.x + leashDirection * 22,
      hand.y + handLift,
      collar.x - leashDirection * leashMidPull,
      collar.y + collarLift,
      collar.x,
      collar.y,
    )
    .stroke({
      color: isTaut ? 0xcb6a2d : 0x6d513c,
      width: 4.5,
      cap: 'round',
      join: 'round',
    });
}

export { getShibaBubblePosition, getShibaCollarAnchor, getWalkerHandAnchor } from './pixiSceneModels';
export type {
  ActorSceneModel,
  EventAnimalSceneModel,
  ShibaSceneModel,
  WalkerSceneModel,
} from './pixiSceneModels';

export function drawActorScene(graphics: Graphics, scene: ActorSceneModel) {
  graphics.clear();

  if (scene.eventAnimal?.type === 'cat') {
    drawCat(graphics, scene.eventAnimal);
  }

  if (scene.renderWalker !== false) {
    drawWalker(graphics, scene.walker);
  }
  if (scene.renderShiba !== false) {
    drawShiba(graphics, scene.shiba);
  }
  drawLeash(graphics, scene.walker, scene.shiba, scene.isPulling);

  if (scene.eventAnimal?.type === 'dog') {
    drawDog(graphics, scene.eventAnimal);
  }
}
