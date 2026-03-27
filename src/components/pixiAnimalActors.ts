import type { Graphics } from 'pixi.js';
import { limbStroke, localPoint, point, resolveFacing } from './pixiSceneModels';
import type { EventAnimalSceneModel } from './pixiSceneModels';

type LocalCoord = readonly [number, number];

interface LegStyle {
  upperLength: number;
  lowerLength: number;
  swing: number;
  lift: number;
  upperWidth: number;
  lowerWidth: number;
  pawOffset: number;
  pawRx: number;
  pawRy: number;
}

interface LegPalette {
  limb: number;
  paw: number;
  alpha: number;
}

const CAT_BOB = 1.5;
const DOG_BOB = 1.8;

const CAT_LEG_STYLE: LegStyle = {
  upperLength: 24,
  lowerLength: 27,
  swing: 12,
  lift: 5,
  upperWidth: 8.5,
  lowerWidth: 7.5,
  pawOffset: 5,
  pawRx: 7,
  pawRy: 3.6,
};

const DOG_LEG_STYLE: LegStyle = {
  upperLength: 28,
  lowerLength: 31,
  swing: 15,
  lift: 6,
  upperWidth: 10,
  lowerWidth: 9,
  pawOffset: 6,
  pawRx: 8.5,
  pawRy: 4,
};

function getAnimalBob(animal: EventAnimalSceneModel, amount: number) {
  return Math.sin(animal.stridePhase * 2) * amount * animal.gait;
}

function animalBobAmount(animal: EventAnimalSceneModel) {
  return animal.type === 'cat' ? CAT_BOB : DOG_BOB;
}

function localAt(
  animal: EventAnimalSceneModel,
  bob: number,
  localX: number,
  localY: number,
  yShift = 0,
) {
  return localPoint(
    animal.x,
    animal.groundY,
    localX,
    localY + yShift,
    resolveFacing(animal.facing),
    bob,
  );
}

function localPoly(
  animal: EventAnimalSceneModel,
  bob: number,
  coords: LocalCoord[],
  yShift = 0,
) {
  return coords.flatMap(([x, y]) => {
    const mapped = localAt(animal, bob, x, y, yShift);
    return [mapped.x, mapped.y];
  });
}

function drawAnimalLeg(
  graphics: Graphics,
  animal: EventAnimalSceneModel,
  hipLocalX: number,
  hipLocalY: number,
  phaseOffset: number,
  style: LegStyle,
  palette: LegPalette,
) {
  const facing = resolveFacing(animal.facing);
  const bob = getAnimalBob(animal, animalBobAmount(animal));
  const phase = animal.stridePhase + phaseOffset;
  const reach = Math.sin(phase) * style.swing * animal.gait;
  const lift = Math.max(0, Math.cos(phase)) * style.lift * animal.gait;
  const hip = localPoint(animal.x, animal.groundY, hipLocalX, hipLocalY, facing, bob);
  const knee = point(hip.x + reach * facing * 0.56, hip.y + style.upperLength - lift * 0.24);
  const ankle = point(knee.x + reach * facing * 0.34, knee.y + style.lowerLength - lift);

  limbStroke(graphics, [hip, knee], palette.limb, style.upperWidth, palette.alpha);
  limbStroke(graphics, [knee, ankle], palette.limb, style.lowerWidth, palette.alpha);
  graphics.ellipse(
    ankle.x + facing * style.pawOffset,
    ankle.y + style.pawRy * 0.4,
    style.pawRx,
    style.pawRy,
  ).fill({
    color: palette.paw,
    alpha: palette.alpha,
  });
}

function drawCatTail(graphics: Graphics, animal: EventAnimalSceneModel, bob: number) {
  const sway = Math.sin(animal.stridePhase * 2 + Math.PI / 3) * 4 * animal.gait;
  const base = localAt(animal, bob, -46, -70);
  const ctrl1 = localAt(animal, bob, -70, -96 - sway * 0.2);
  const ctrl2 = localAt(animal, bob, -80, -132 - sway);
  const tip = localAt(animal, bob, -56, -122 - sway * 0.35);

  graphics.moveTo(base.x, base.y)
    .bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, tip.x, tip.y)
    .stroke({ color: 0x534b44, width: 8.5, cap: 'round', join: 'round' });
  graphics.moveTo(base.x, base.y)
    .bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, tip.x, tip.y)
    .stroke({ color: 0x93867a, width: 2.2, alpha: 0.28, cap: 'round', join: 'round' });
}

function drawDogTail(graphics: Graphics, animal: EventAnimalSceneModel, bob: number) {
  const sway = animal.sniffing ? -2 : Math.sin(animal.stridePhase * 2 + Math.PI / 4) * 3.2 * animal.gait;
  const base = localAt(animal, bob, -60, -86);
  const ctrl1 = localAt(animal, bob, -88, -92 + sway * 0.25);
  const ctrl2 = localAt(animal, bob, -96, -118 + sway);
  const tip = localAt(animal, bob, -70, -112 + sway * 0.4);

  graphics.moveTo(base.x, base.y)
    .bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, tip.x, tip.y)
    .stroke({ color: 0x474240, width: 11, cap: 'round', join: 'round' });
  graphics.moveTo(base.x, base.y)
    .bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, tip.x, tip.y)
    .stroke({ color: 0x8f8375, width: 2.6, alpha: 0.2, cap: 'round', join: 'round' });
}

export function drawCat(graphics: Graphics, animal: EventAnimalSceneModel) {
  const facing = resolveFacing(animal.facing);
  const bob = getAnimalBob(animal, CAT_BOB);
  const nearPhase = animal.stridePhase;
  const farPhase = animal.stridePhase + Math.PI;
  const headCenter = localAt(animal, bob, 60, -76);
  const muzzleCenter = localAt(animal, bob, 76, -68);

  graphics.ellipse(animal.x, animal.groundY - 4, 60, 8.5).fill({
    color: 0x1f1712,
    alpha: 0.12,
  });

  drawAnimalLeg(graphics, animal, -18, -66, farPhase, CAT_LEG_STYLE, {
    limb: 0x4b443f,
    paw: 0xd7cec2,
    alpha: 0.7,
  });
  drawAnimalLeg(graphics, animal, 4, -66, nearPhase, CAT_LEG_STYLE, {
    limb: 0x5c544d,
    paw: 0xdcd2c6,
    alpha: 0.76,
  });

  drawCatTail(graphics, animal, bob);

  graphics.poly(localPoly(animal, bob, [
    [-48, -60],
    [-34, -80],
    [-4, -92],
    [26, -92],
    [52, -84],
    [70, -72],
    [72, -58],
    [62, -48],
    [40, -41],
    [14, -38],
    [-12, -40],
    [-38, -48],
    [-52, -56],
  ])).fill({ color: 0x655c54 });

  graphics.ellipse(animal.x - 10 * facing, animal.groundY - 69 + bob, 20, 16).fill({
    color: 0x504841,
    alpha: 0.38,
  });
  graphics.poly(localPoly(animal, bob, [
    [-16, -51],
    [6, -40],
    [32, -36],
    [54, -41],
    [50, -31],
    [24, -28],
    [-2, -31],
    [-22, -41],
    [-28, -48],
  ])).fill({ color: 0xd9d0c4, alpha: 0.9 });
  limbStroke(graphics, [
    localAt(animal, bob, -10, -78),
    localAt(animal, bob, 18, -80),
    localAt(animal, bob, 46, -70),
  ], 0x443a34, 3.8, 0.34);
  limbStroke(graphics, [
    localAt(animal, bob, 0, -64),
    localAt(animal, bob, 20, -62),
    localAt(animal, bob, 38, -58),
  ], 0x8c7d6f, 2.6, 0.26);

  drawAnimalLeg(graphics, animal, 26, -66, farPhase, CAT_LEG_STYLE, {
    limb: 0x5a5149,
    paw: 0xddd3c7,
    alpha: 0.92,
  });
  drawAnimalLeg(graphics, animal, 48, -66, nearPhase, CAT_LEG_STYLE, {
    limb: 0x665b53,
    paw: 0xe4dbcf,
    alpha: 1,
  });

  graphics.poly(localPoly(animal, bob, [
    [46, -88],
    [54, -109],
    [62, -88],
  ])).fill({ color: 0x4b433d });
  graphics.poly(localPoly(animal, bob, [
    [60, -88],
    [70, -110],
    [80, -89],
  ])).fill({ color: 0x4b433d });
  graphics.poly(localPoly(animal, bob, [
    [49, -88],
    [54, -103],
    [59, -88],
  ])).fill({ color: 0xc3b2a0, alpha: 0.72 });
  graphics.poly(localPoly(animal, bob, [
    [66, -88],
    [72, -104],
    [78, -89],
  ])).fill({ color: 0xc3b2a0, alpha: 0.72 });

  graphics.poly(localPoly(animal, bob, [
    [40, -79],
    [50, -92],
    [67, -93],
    [79, -85],
    [84, -72],
    [81, -60],
    [70, -51],
    [57, -49],
    [45, -55],
    [38, -66],
  ])).fill({ color: 0x6b6157 });
  graphics.poly(localPoly(animal, bob, [
    [46, -61],
    [58, -50],
    [72, -50],
    [82, -57],
    [76, -46],
    [61, -43],
    [48, -47],
    [41, -56],
  ])).fill({ color: 0xded5c8, alpha: 0.88 });
  graphics.ellipse(headCenter.x + 1 * facing, headCenter.y + 8, 15, 11).fill({
    color: 0xd7cdbf,
    alpha: 0.7,
  });
  graphics.ellipse(muzzleCenter.x, muzzleCenter.y, 12, 7.4).fill({ color: 0xdcd2c5 });
  graphics.circle(headCenter.x - 2 * facing, headCenter.y - 4, 2.5).fill({ color: 0x1d1715 });
  graphics.ellipse(muzzleCenter.x + 5 * facing, muzzleCenter.y - 0.5, 4.8, 3.8).fill({
    color: 0x2b2421,
  });
  limbStroke(graphics, [
    localAt(animal, bob, 60, -61),
    localAt(animal, bob, 67, -59),
    localAt(animal, bob, 75, -61),
  ], 0xb09e8d, 2, 0.66);
  limbStroke(graphics, [
    localAt(animal, bob, 53, -68),
    localAt(animal, bob, 45, -70),
  ], 0xe7dfd5, 1.2, 0.56);
  limbStroke(graphics, [
    localAt(animal, bob, 80, -68),
    localAt(animal, bob, 90, -70),
  ], 0xe7dfd5, 1.2, 0.56);
}

export function drawDog(graphics: Graphics, animal: EventAnimalSceneModel) {
  const facing = resolveFacing(animal.facing);
  const bob = getAnimalBob(animal, DOG_BOB);
  const nearPhase = animal.stridePhase;
  const farPhase = animal.stridePhase + Math.PI;
  const headDrop = animal.sniffing ? 18 : 0;
  const headLead = animal.sniffing ? 9 : 0;
  const headCenter = localAt(animal, bob, 88 + headLead, -98 + headDrop);
  const muzzleCenter = localAt(animal, bob, 116 + headLead, -91 + headDrop);

  graphics.ellipse(animal.x + 4, animal.groundY - 4, 70, 9).fill({
    color: 0x1d1713,
    alpha: 0.14,
  });

  drawAnimalLeg(graphics, animal, -34, -82, farPhase, DOG_LEG_STYLE, {
    limb: 0x5c5047,
    paw: 0xd8d0c3,
    alpha: 0.78,
  });
  drawAnimalLeg(graphics, animal, -8, -82, nearPhase, DOG_LEG_STYLE, {
    limb: 0x6d5f52,
    paw: 0xdcd4c7,
    alpha: 0.84,
  });

  drawDogTail(graphics, animal, bob);

  graphics.poly(localPoly(animal, bob, [
    [-66, -74],
    [-52, -94],
    [-22, -108],
    [16, -112],
    [48, -104],
    [70, -88],
    [72, -72],
    [58, -59],
    [30, -50],
    [2, -43],
    [-26, -46],
    [-56, -59],
    [-68, -70],
  ])).fill({ color: 0x8e7d68 });

  graphics.poly(localPoly(animal, bob, [
    [-36, -92],
    [-2, -110],
    [34, -106],
    [56, -92],
    [30, -82],
    [-6, -82],
    [-38, -88],
  ])).fill({ color: 0x343231, alpha: 0.92 });
  graphics.ellipse(animal.x + 2 * facing, animal.groundY - 60 + bob, 45, 15).fill({
    color: 0xd7cdbd,
    alpha: 0.95,
  });
  graphics.ellipse(animal.x - 26 * facing, animal.groundY - 68 + bob, 21, 16).fill({
    color: 0x6c5f54,
    alpha: 0.28,
  });
  limbStroke(graphics, [
    localAt(animal, bob, -20, -94),
    localAt(animal, bob, 10, -106),
    localAt(animal, bob, 42, -98),
  ], 0xb9ab99, 3.8, 0.18);

  drawAnimalLeg(graphics, animal, 28, -82, farPhase, DOG_LEG_STYLE, {
    limb: 0x77695a,
    paw: 0xded5c8,
    alpha: 0.96,
  });
  drawAnimalLeg(graphics, animal, 52, -82, nearPhase, DOG_LEG_STYLE, {
    limb: 0x877764,
    paw: 0xe2d9cc,
    alpha: 1,
  });

  graphics.poly(localPoly(animal, bob, [
    [70 + headLead, -110 + headDrop],
    [82 + headLead, -144 + headDrop],
    [90 + headLead, -110 + headDrop],
  ])).fill({ color: 0x2a2828 });
  graphics.poly(localPoly(animal, bob, [
    [92 + headLead, -108 + headDrop],
    [108 + headLead, -142 + headDrop],
    [118 + headLead, -104 + headDrop],
  ])).fill({ color: 0x2a2828 });
  graphics.ellipse(headCenter.x, headCenter.y, 32, 24).fill({ color: 0x8a7a65 });
  graphics.poly(localPoly(animal, bob, [
    [70 + headLead, -100 + headDrop],
    [88 + headLead, -110 + headDrop],
    [106 + headLead, -102 + headDrop],
    [120 + headLead, -92 + headDrop],
    [102 + headLead, -86 + headDrop],
    [82 + headLead, -88 + headDrop],
    [68 + headLead, -94 + headDrop],
  ])).fill({ color: 0x333130, alpha: 0.9 });
  graphics.ellipse(headCenter.x - 5 * facing, headCenter.y - 2, 13, 12).fill({
    color: 0x6f6154,
    alpha: 0.3,
  });
  graphics.ellipse(muzzleCenter.x, muzzleCenter.y, 24, 12.5).fill({ color: 0x2c2928 });
  graphics.poly(localPoly(animal, bob, [
    [66 + headLead, -93 + headDrop],
    [80 + headLead, -84 + headDrop],
    [96 + headLead, -82 + headDrop],
    [109 + headLead, -87 + headDrop],
    [103 + headLead, -74 + headDrop],
    [85 + headLead, -71 + headDrop],
    [70 + headLead, -79 + headDrop],
  ])).fill({ color: 0xdccfbe, alpha: 0.94 });
  graphics.circle(headCenter.x + 7 * facing, headCenter.y - 5, 3.4).fill({ color: 0x171312 });
  graphics.circle(muzzleCenter.x + 8 * facing, muzzleCenter.y - 1, 4.2).fill({ color: 0x151110 });
  graphics.circle(muzzleCenter.x + 9 * facing, muzzleCenter.y - 2, 1.1).fill({
    color: 0xffffff,
    alpha: 0.22,
  });
  limbStroke(graphics, [
    localAt(animal, bob, 76 + headLead, -78 + headDrop),
    localAt(animal, bob, 90 + headLead, -74 + headDrop),
    localAt(animal, bob, 102 + headLead, -77 + headDrop),
  ], 0xb89b86, 2.4, 0.82);
  limbStroke(graphics, [
    localAt(animal, bob, 70 + headLead, -101 + headDrop),
    localAt(animal, bob, 88 + headLead, -104 + headDrop),
    localAt(animal, bob, 102 + headLead, -98 + headDrop),
  ], 0x2a2828, 2.6, 0.26);
}
