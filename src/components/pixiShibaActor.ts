import type { Graphics } from 'pixi.js';
import {
  getShibaBob,
  getShibaCollarAnchor,
  limbStroke,
  localPoint,
  point,
  resolveFacing,
} from './pixiSceneModels';
import type { ShibaSceneModel } from './pixiSceneModels';

function drawShibaLeg(
  graphics: Graphics,
  model: ShibaSceneModel,
  hipLocalX: number,
  hipLocalY: number,
  phaseOffset: number,
  color: number,
  pawColor: number,
  alpha: number,
) {
  const facing = resolveFacing(model.facing);
  const bob = getShibaBob(model);
  const phase = model.stridePhase + phaseOffset;
  const swing = Math.sin(phase) * 13 * model.gait;
  const lift = Math.max(0, Math.cos(phase)) * 5.5 * model.gait;
  const hip = localPoint(model.x, model.groundY, hipLocalX, hipLocalY, facing, bob);
  const knee = point(hip.x + swing * facing * 0.52, hip.y + 31 - lift * 0.16);
  const ankle = point(knee.x + swing * facing * 0.34, knee.y + 35 - lift);

  limbStroke(graphics, [hip, knee], color, 13.5, alpha);
  limbStroke(graphics, [knee, ankle], color, 12.2, alpha);
  graphics.ellipse(ankle.x + facing * 8, ankle.y + 4, 10.5, 5.3).fill({
    color: pawColor,
    alpha,
  });
}

export function drawShiba(graphics: Graphics, model: ShibaSceneModel) {
  const facing = resolveFacing(model.facing);
  const bob = getShibaBob(model);
  const fur = model.rainy ? 0xbf7333 : 0xcf7d34;
  const furShade = model.rainy ? 0x8e4e20 : 0xa85d25;
  const furDark = model.rainy ? 0x6c3616 : 0x7f411a;
  const cream = 0xfff1da;
  const creamShade = 0xefdbc2;

  graphics.ellipse(model.x, model.groundY - 5, 76, 12).fill({
    color: 0x261a13,
    alpha: 0.16,
  });

  drawShibaLeg(graphics, model, -34, -86, Math.PI, 0x92471b, 0xf7ebd7, 0.78);
  drawShibaLeg(graphics, model, -12, -84, 0, 0x9b4f1f, 0xf7ebd7, 0.82);

  graphics
    .moveTo(model.x - 62 * facing, model.groundY - 108 + bob)
    .bezierCurveTo(
      model.x - 88 * facing,
      model.groundY - 136 + bob,
      model.x - 76 * facing,
      model.groundY - 164 + bob,
      model.x - 44 * facing,
      model.groundY - 154 + bob,
    )
    .bezierCurveTo(
      model.x - 20 * facing,
      model.groundY - 146 + bob,
      model.x - 18 * facing,
      model.groundY - 120 + bob,
      model.x - 42 * facing,
      model.groundY - 118 + bob,
    )
    .stroke({ color: furShade, width: 14, cap: 'round', join: 'round' });
  graphics
    .moveTo(model.x - 60 * facing, model.groundY - 108 + bob)
    .bezierCurveTo(
      model.x - 80 * facing,
      model.groundY - 130 + bob,
      model.x - 68 * facing,
      model.groundY - 152 + bob,
      model.x - 44 * facing,
      model.groundY - 146 + bob,
    )
    .bezierCurveTo(
      model.x - 28 * facing,
      model.groundY - 140 + bob,
      model.x - 26 * facing,
      model.groundY - 124 + bob,
      model.x - 42 * facing,
      model.groundY - 122 + bob,
    )
    .stroke({ color: creamShade, width: 4, cap: 'round', join: 'round', alpha: 0.28 });

  graphics.poly(
    [
      localPoint(model.x, model.groundY, -72, -100, facing, bob),
      localPoint(model.x, model.groundY, -50, -120, facing, bob),
      localPoint(model.x, model.groundY, -14, -128, facing, bob),
      localPoint(model.x, model.groundY, 24, -126, facing, bob),
      localPoint(model.x, model.groundY, 50, -120, facing, bob),
      localPoint(model.x, model.groundY, 66, -108, facing, bob),
      localPoint(model.x, model.groundY, 74, -92, facing, bob),
      localPoint(model.x, model.groundY, 72, -82, facing, bob),
      localPoint(model.x, model.groundY, 56, -72, facing, bob),
      localPoint(model.x, model.groundY, 24, -66, facing, bob),
      localPoint(model.x, model.groundY, -8, -66, facing, bob),
      localPoint(model.x, model.groundY, -38, -72, facing, bob),
      localPoint(model.x, model.groundY, -62, -84, facing, bob),
      localPoint(model.x, model.groundY, -72, -96, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: fur });
  graphics.ellipse(model.x - 28 * facing, model.groundY - 92 + bob, 34, 24).fill({
    color: fur,
    alpha: 0.94,
  });
  graphics.ellipse(model.x + 28 * facing, model.groundY - 94 + bob, 28, 24).fill({
    color: fur,
    alpha: 0.94,
  });

  graphics.poly(
    [
      localPoint(model.x, model.groundY, -44, -112, facing, bob),
      localPoint(model.x, model.groundY, -10, -124, facing, bob),
      localPoint(model.x, model.groundY, 30, -123, facing, bob),
      localPoint(model.x, model.groundY, 56, -112, facing, bob),
      localPoint(model.x, model.groundY, 48, -98, facing, bob),
      localPoint(model.x, model.groundY, 12, -92, facing, bob),
      localPoint(model.x, model.groundY, -24, -95, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: furDark, alpha: 0.68 });

  graphics.poly(
    [
      localPoint(model.x, model.groundY, -6, -104, facing, bob),
      localPoint(model.x, model.groundY, 34, -102, facing, bob),
      localPoint(model.x, model.groundY, 62, -88, facing, bob),
      localPoint(model.x, model.groundY, 74, -74, facing, bob),
      localPoint(model.x, model.groundY, 32, -54, facing, bob),
      localPoint(model.x, model.groundY, -12, -56, facing, bob),
      localPoint(model.x, model.groundY, -18, -78, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: cream, alpha: 0.98 });
  graphics.ellipse(model.x + 8 * facing, model.groundY - 86 + bob, 40, 19).fill({
    color: creamShade,
    alpha: 0.24,
  });
  graphics.ellipse(model.x - 8 * facing, model.groundY - 102 + bob, 30, 14).fill({
    color: 0xffffff,
    alpha: 0.08,
  });

  drawShibaLeg(graphics, model, 24, -88, Math.PI, 0xa55723, 0xfff2dc, 0.94);
  drawShibaLeg(graphics, model, 48, -90, 0, 0xb26328, 0xfff2dc, 1);

  graphics.poly(
    [
      localPoint(model.x, model.groundY, 46, -116, facing, bob),
      localPoint(model.x, model.groundY, 64, -120, facing, bob),
      localPoint(model.x, model.groundY, 84, -106, facing, bob),
      localPoint(model.x, model.groundY, 74, -88, facing, bob),
      localPoint(model.x, model.groundY, 56, -90, facing, bob),
      localPoint(model.x, model.groundY, 42, -100, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: furDark, alpha: 0.42 });

  const headCenter = localPoint(model.x, model.groundY, 82, -102, facing, bob);
  graphics.ellipse(headCenter.x - 6 * facing, headCenter.y + 1, 28, 26).fill({ color: fur });
  graphics.ellipse(headCenter.x + 10 * facing, headCenter.y + 2, 31, 24).fill({ color: fur });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, 64, -126, facing, bob),
      localPoint(model.x, model.groundY, 82, -138, facing, bob),
      localPoint(model.x, model.groundY, 102, -136, facing, bob),
      localPoint(model.x, model.groundY, 112, -120, facing, bob),
      localPoint(model.x, model.groundY, 96, -104, facing, bob),
      localPoint(model.x, model.groundY, 70, -106, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: furDark, alpha: 0.4 });

  graphics.poly(
    [
      localPoint(model.x, model.groundY, 66, -130, facing, bob),
      localPoint(model.x, model.groundY, 78, -162, facing, bob),
      localPoint(model.x, model.groundY, 90, -129, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: furShade });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, 90, -132, facing, bob),
      localPoint(model.x, model.groundY, 104, -164, facing, bob),
      localPoint(model.x, model.groundY, 116, -131, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: furShade });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, 72, -128, facing, bob),
      localPoint(model.x, model.groundY, 78, -148, facing, bob),
      localPoint(model.x, model.groundY, 85, -128, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: creamShade, alpha: 0.54 });
  graphics.poly(
    [
      localPoint(model.x, model.groundY, 95, -130, facing, bob),
      localPoint(model.x, model.groundY, 100, -149, facing, bob),
      localPoint(model.x, model.groundY, 107, -129, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: creamShade, alpha: 0.54 });

  graphics.poly(
    [
      localPoint(model.x, model.groundY, 68, -98, facing, bob),
      localPoint(model.x, model.groundY, 94, -110, facing, bob),
      localPoint(model.x, model.groundY, 118, -94, facing, bob),
      localPoint(model.x, model.groundY, 114, -74, facing, bob),
      localPoint(model.x, model.groundY, 86, -70, facing, bob),
      localPoint(model.x, model.groundY, 68, -82, facing, bob),
    ].flatMap(({ x, y }) => [x, y]),
  ).fill({ color: cream, alpha: 0.98 });
  graphics.ellipse(headCenter.x + 29 * facing, headCenter.y + 4, 17.5, 10.8).fill({
    color: 0x2d241f,
  });
  graphics.ellipse(headCenter.x + 8 * facing, headCenter.y + 10, 13, 9).fill({
    color: creamShade,
    alpha: 0.9,
  });

  graphics.circle(headCenter.x + 9 * facing, headCenter.y - 7, 3.8).fill({ color: 0x211a17 });
  graphics.circle(headCenter.x + 31 * facing, headCenter.y + 4, 4.8).fill({ color: 0x2d241f });
  graphics.circle(headCenter.x + 30 * facing, headCenter.y + 3, 1.3).fill({
    color: 0xffffff,
    alpha: 0.3,
  });
  limbStroke(
    graphics,
    [
      point(headCenter.x + 2 * facing, headCenter.y - 3),
      point(headCenter.x + 18 * facing, headCenter.y - 5),
      point(headCenter.x + 27 * facing, headCenter.y - 1),
    ],
    furDark,
    2.4,
    0.3,
  );
  limbStroke(
    graphics,
    [
      point(headCenter.x + 6 * facing, headCenter.y - 2),
      point(headCenter.x + 18 * facing, headCenter.y - 1),
    ],
    0xffffff,
    2,
    0.18,
  );
  limbStroke(
    graphics,
    [
      point(headCenter.x + 10 * facing, headCenter.y + 14),
      point(headCenter.x + 22 * facing, headCenter.y + 16),
    ],
    0xd39a77,
    3,
    0.82,
  );

  const collar = getShibaCollarAnchor(model);
  graphics.ellipse(collar.x, collar.y, 9, 12).stroke({
    color: 0xbf5636,
    width: 4.8,
  });
}
