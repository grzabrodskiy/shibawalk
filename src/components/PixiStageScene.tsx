import { Application, extend } from '@pixi/react';
import { Container, Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';
import type { DestinationKey, LevelDefinition, WorldProp } from '../game';
import { drawActorScene } from './pixiActors';
import type { ActorSceneModel } from './pixiActors';

extend({ Container, Graphics });

type StageTheme = {
  skyTop: number;
  skyMid: number;
  skyBottom: number;
  sun: number;
  tint: number;
  hillA: number;
  hillB: number;
  hillC: number;
  grass: number;
  grassStripe: number;
  grassShadow: number;
  curb: number;
  road: number;
};

const STAGE_THEMES: Record<DestinationKey, StageTheme> = {
  home: {
    skyTop: 0xffd89a,
    skyMid: 0xffc69a,
    skyBottom: 0xf3debb,
    sun: 0xfff4ce,
    tint: 0xc79152,
    hillA: 0x78a164,
    hillB: 0x6b965d,
    hillC: 0x86ae6d,
    grass: 0x5ca46c,
    grassStripe: 0x7abb72,
    grassShadow: 0x45653f,
    curb: 0xded5ca,
    road: 0x4f4945,
  },
  park: {
    skyTop: 0xffd89a,
    skyMid: 0xffc69a,
    skyBottom: 0xf3debb,
    sun: 0xfff4ce,
    tint: 0xc79152,
    hillA: 0x78a164,
    hillB: 0x6b965d,
    hillC: 0x86ae6d,
    grass: 0x5ca46c,
    grassStripe: 0x7abb72,
    grassShadow: 0x45653f,
    curb: 0xded5ca,
    road: 0x4f4945,
  },
  cafe: {
    skyTop: 0xf1d2b2,
    skyMid: 0xe4bc99,
    skyBottom: 0xd6cdc5,
    sun: 0xffefc2,
    tint: 0xaf7b4a,
    hillA: 0xc2b6a5,
    hillB: 0xaca08f,
    hillC: 0xd0c4b0,
    grass: 0x68906d,
    grassStripe: 0x83a784,
    grassShadow: 0x4b6554,
    curb: 0xd7d0c9,
    road: 0x504b48,
  },
  postOffice: {
    skyTop: 0xc8dbef,
    skyMid: 0xb8d0e7,
    skyBottom: 0xe6d9c8,
    sun: 0xf4f5ea,
    tint: 0x7597b3,
    hillA: 0x90a9b8,
    hillB: 0x7e97a9,
    hillC: 0xb2c0c7,
    grass: 0x5f8a77,
    grassStripe: 0x79a095,
    grassShadow: 0x49665f,
    curb: 0xd8d7d3,
    road: 0x4c4a4d,
  },
  restaurant: {
    skyTop: 0xb8d7f6,
    skyMid: 0xa3c3ef,
    skyBottom: 0xf3debf,
    sun: 0xfff2d4,
    tint: 0x6b94b5,
    hillA: 0x97acc4,
    hillB: 0x7f97b4,
    hillC: 0xb3c5d6,
    grass: 0x578b76,
    grassStripe: 0x79ae94,
    grassShadow: 0x42635a,
    curb: 0xd9d7d1,
    road: 0x4a4a50,
  },
  petStore: {
    skyTop: 0xf4dd9d,
    skyMid: 0xefc48d,
    skyBottom: 0xe8d7cf,
    sun: 0xfff0cc,
    tint: 0xc28956,
    hillA: 0x8ab07a,
    hillB: 0x769b69,
    hillC: 0xa5c38c,
    grass: 0x62a072,
    grassStripe: 0x84bc89,
    grassShadow: 0x476854,
    curb: 0xddd5cb,
    road: 0x4f4a48,
  },
};

interface VisibleWorldProp {
  prop: WorldProp;
  x: number;
  collected: boolean;
}

interface PixiStageSceneProps {
  stageWidth: number;
  stageHeight: number;
  progress: number;
  elapsed: number;
  velocity: number;
  activeLevel: LevelDefinition;
  isRaining: boolean;
  visibleProps: VisibleWorldProp[];
  actorScene: ActorSceneModel;
}

function drawCloud(graphics: Graphics, x: number, y: number, scale: number, alpha: number) {
  graphics.circle(x, y, 22 * scale).fill({ color: 0xffffff, alpha });
  graphics.circle(x + 28 * scale, y - 8 * scale, 28 * scale).fill({ color: 0xffffff, alpha });
  graphics.circle(x + 58 * scale, y, 24 * scale).fill({ color: 0xffffff, alpha });
  graphics.roundRect(x - 8 * scale, y, 86 * scale, 26 * scale, 14 * scale).fill({
    color: 0xffffff,
    alpha,
  });
}

function drawDistantBlock(
  graphics: Graphics,
  x: number,
  baseY: number,
  width: number,
  height: number,
  bodyColor: number,
  roofColor: number,
  alpha = 0.24,
) {
  graphics.roundRect(x, baseY - height, width, height, 12).fill({ color: bodyColor, alpha });
  graphics.roundRect(x + 8, baseY - height - 16, width - 16, 20, 10).fill({
    color: roofColor,
    alpha: alpha * 0.9,
  });
}

function drawMountain(
  graphics: Graphics,
  x: number,
  baseY: number,
  width: number,
  height: number,
  color: number,
  alpha: number,
) {
  graphics.poly([
    x,
    baseY,
    x + width * 0.42,
    baseY - height,
    x + width,
    baseY,
  ]).fill({ color, alpha });
}

function drawParkBackdrop(
  graphics: Graphics,
  width: number,
  height: number,
  hillShift: number,
  houseShift: number,
  cameraLift: number,
  theme: StageTheme,
) {
  const grassTop = height - 342;

  graphics.ellipse(hillShift + width * 0.18, height * 0.56 + cameraLift, width * 0.3, height * 0.17).fill({
    color: theme.hillA,
    alpha: 0.96,
  });
  graphics.ellipse(hillShift + width * 0.62, height * 0.55 + cameraLift, width * 0.36, height * 0.18).fill({
    color: theme.hillB,
    alpha: 0.92,
  });
  graphics.ellipse(hillShift + width * 1.02, height * 0.57 + cameraLift, width * 0.3, height * 0.17).fill({
    color: theme.hillC,
    alpha: 0.92,
  });

  for (let index = -1; index < 5; index += 1) {
    const x = houseShift + index * (width * 0.26) + width * 0.08;
    const baseY = grassTop + 18;
    const w = 86 + (index % 2) * 22;
    const h = 62 + (index % 3) * 10;
    drawDistantBlock(graphics, x, baseY, w, h, 0xd8b295, 0xc28f6c, 0.22);
  }

  graphics.roundRect(width * 0.72, grassTop - 54, 72, 32, 14).fill({ color: 0xf0e1bf, alpha: 0.22 });
  graphics.moveTo(width * 0.76, grassTop - 22).arc(width * 0.82, grassTop - 22, 28, Math.PI, Math.PI * 2).stroke({
    color: 0x7f9866,
    width: 5,
    alpha: 0.24,
  });
}

function drawCafeBackdrop(
  graphics: Graphics,
  width: number,
  height: number,
  houseShift: number,
) {
  const grassTop = height - 342;
  const baseY = grassTop + 8;

  for (let index = -2; index < 8; index += 1) {
    const x = houseShift + index * 120;
    const w = 86 + (index % 3) * 18;
    const h = 92 + ((index + 2) % 4) * 18;
    drawDistantBlock(graphics, x, baseY, w, h, 0xbeae9d, 0x8b6752, 0.26);
    graphics.roundRect(x + 14, baseY - h + 22, w - 28, 10, 999).fill({ color: 0x714936, alpha: 0.18 });
    for (let windowIndex = 0; windowIndex < 3; windowIndex += 1) {
      graphics.roundRect(x + 16 + windowIndex * 22, baseY - h + 42, 10, 16, 4).fill({
        color: 0xf3e1b6,
        alpha: 0.14,
      });
    }
  }

  graphics.moveTo(-20, grassTop - 98).lineTo(width + 20, grassTop - 118).stroke({
    color: 0x7f6f65,
    width: 2,
    alpha: 0.3,
  });
  graphics.moveTo(-20, grassTop - 80).lineTo(width + 20, grassTop - 98).stroke({
    color: 0x7f6f65,
    width: 2,
    alpha: 0.2,
  });
}

function drawZurichBackdrop(
  graphics: Graphics,
  width: number,
  height: number,
  houseShift: number,
) {
  const grassTop = height - 342;
  const waterTop = grassTop - 94;
  const waterfront = grassTop - 30;

  graphics.rect(0, waterTop, width, 72).fill({ color: 0x7db1d0, alpha: 0.34 });
  graphics.rect(0, waterTop + 22, width, 6).fill({ color: 0xdff5ff, alpha: 0.16 });

  for (let index = -2; index < 8; index += 1) {
    const x = houseShift + index * 94;
    const w = 78 + (index % 2) * 12;
    const h = 70 + ((index + 1) % 3) * 12;
    drawDistantBlock(graphics, x, waterfront, w, h, 0xcfb79f, 0x8c5e4a, 0.24);
  }

  graphics.roundRect(width * 0.22, waterfront - 132, 18, 132, 8).fill({ color: 0x8d7f74, alpha: 0.32 });
  graphics.poly([
    width * 0.205,
    waterfront - 132,
    width * 0.229,
    waterfront - 170,
    width * 0.253,
    waterfront - 132,
  ]).fill({ color: 0x8c5a48, alpha: 0.32 });
  graphics.roundRect(width * 0.68, waterfront - 154, 16, 154, 8).fill({ color: 0x7d7771, alpha: 0.28 });
  graphics.poly([
    width * 0.665,
    waterfront - 154,
    width * 0.688,
    waterfront - 198,
    width * 0.711,
    waterfront - 154,
  ]).fill({ color: 0x765347, alpha: 0.3 });
}

function drawLakeBackdrop(
  graphics: Graphics,
  width: number,
  height: number,
  hillShift: number,
) {
  const grassTop = height - 342;
  const lakeTop = grassTop - 92;

  drawMountain(graphics, hillShift + width * 0.02, grassTop - 36, width * 0.34, 128, 0x8da5bb, 0.34);
  drawMountain(graphics, hillShift + width * 0.22, grassTop - 36, width * 0.42, 148, 0x738ea8, 0.3);
  drawMountain(graphics, hillShift + width * 0.54, grassTop - 36, width * 0.38, 120, 0xa7bbcb, 0.28);
  graphics.rect(0, lakeTop, width, 70).fill({ color: 0x7fb2cf, alpha: 0.36 });
  graphics.rect(0, lakeTop + 22, width, 5).fill({ color: 0xe4f7ff, alpha: 0.16 });
  for (let light = 0; light < width + 80; light += 86) {
    graphics.circle(light, grassTop - 10, 3.5).fill({ color: 0xf7e8be, alpha: 0.24 });
  }
}

function drawMarketBackdrop(
  graphics: Graphics,
  width: number,
  height: number,
  houseShift: number,
) {
  const grassTop = height - 342;
  const baseY = grassTop + 10;
  const colors = [0xd2b0ce, 0xc8cf9b, 0x9dc4c8, 0xe2bd94];

  for (let index = -1; index < 7; index += 1) {
    const x = houseShift + index * 132;
    const w = 96 + (index % 2) * 18;
    const h = 74 + ((index + 1) % 3) * 12;
    const body = colors[(index + colors.length) % colors.length];
    drawDistantBlock(graphics, x, baseY, w, h, body, 0x7a6858, 0.22);
    graphics.roundRect(x + 12, baseY - h + 40, w - 24, 14, 8).fill({ color: 0xf0e1bc, alpha: 0.26 });
    graphics.rect(x + 12, baseY - h + 54, w - 24, 5).fill({ color: 0x8f6d56, alpha: 0.22 });
  }
}

function drawBuildingShell(
  graphics: Graphics,
  x: number,
  bottom: number,
  width: number,
  height: number,
  bodyColor: number,
  roofColor: number,
  trimColor: number,
) {
  const left = x - width / 2;
  const top = bottom - height;

  graphics.roundRect(left, top + 44, width, height - 44, 18).fill({ color: bodyColor });
  graphics.roundRect(left + 10, top + 8, width - 20, 54, 18).fill({ color: roofColor });
  graphics.roundRect(left + 18, top + 70, width - 36, 24, 16).fill({ color: trimColor });

  return { left, top };
}

function drawTree(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 11, bottom - 92, 22, 92, 10).fill({ color: 0x714c30 });
  graphics.circle(x - 10, bottom - 122, 34).fill({ color: 0x4f7b51 });
  graphics.circle(x + 18, bottom - 130, 42).fill({ color: 0x699b64 });
  graphics.circle(x + 2, bottom - 154, 38).fill({ color: 0x88bc78 });
}

function drawLamp(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 5, bottom - 126, 10, 126, 999).fill({ color: 0x445059 });
  graphics.roundRect(x - 3, bottom - 134, 32, 7, 999).fill({ color: 0x4f5a62 });
  graphics.circle(x + 24, bottom - 136, 16).fill({ color: 0xffedbb, alpha: 0.7 });
  graphics.circle(x + 24, bottom - 136, 26).fill({ color: 0xffdf92, alpha: 0.2 });
}

function drawBench(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 42, bottom - 62, 84, 16, 10).fill({ color: 0x7e5431 });
  graphics.roundRect(x - 42, bottom - 90, 84, 18, 10).fill({ color: 0x8f653c });
  graphics.roundRect(x - 30, bottom - 46, 8, 36, 8).fill({ color: 0x443227 });
  graphics.roundRect(x + 22, bottom - 46, 8, 36, 8).fill({ color: 0x443227 });
}

function drawFlower(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 2, bottom - 30, 4, 30, 999).fill({ color: 0x4b7e50 });
  graphics.circle(x, bottom - 36, 8).fill({ color: 0xf5c76c });
  graphics.circle(x - 8, bottom - 36, 7).fill({ color: 0xe76d70 });
  graphics.circle(x + 8, bottom - 36, 7).fill({ color: 0xe76d70 });
  graphics.circle(x, bottom - 44, 7).fill({ color: 0xe76d70 });
  graphics.circle(x, bottom - 28, 7).fill({ color: 0xe76d70 });
}

function drawTreatBag(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 17, bottom - 44, 34, 44, 9).fill({ color: 0xe1b33f });
  graphics.roundRect(x - 15, bottom - 42, 30, 40, 9).fill({ color: 0xf0cc70, alpha: 0.42 });
  graphics.circle(x, bottom - 24, 8).fill({ color: 0xfff3c6 });
  graphics.circle(x, bottom - 24, 5).fill({ color: 0xd68b3e });
}

function drawParkGate(graphics: Graphics, x: number, bottom: number) {
  graphics.roundRect(x - 70, bottom - 112, 18, 112, 8).fill({ color: 0x6f7c5f });
  graphics.roundRect(x + 52, bottom - 112, 18, 112, 8).fill({ color: 0x6f7c5f });
  graphics.roundRect(x - 64, bottom - 64, 128, 64, 12).fill({ color: 0xe0d1ad, alpha: 0.3 });
  graphics.moveTo(x - 66, bottom - 84).arc(x, bottom - 84, 66, Math.PI, Math.PI * 2).stroke({
    color: 0x75855f,
    width: 12,
  });
}

function drawFountain(graphics: Graphics, x: number, bottom: number) {
  graphics.ellipse(x, bottom - 18, 66, 22).fill({ color: 0x7e95a8 });
  graphics.roundRect(x - 11, bottom - 80, 22, 58, 11).fill({ color: 0x90a6b8 });
  graphics.ellipse(x, bottom - 88, 35, 13).fill({ color: 0xa8bcc9 });
  graphics.moveTo(x - 22, bottom - 88).arc(x, bottom - 88, 22, Math.PI, Math.PI * 2).stroke({
    color: 0xd9f1ff,
    width: 4,
    alpha: 0.8,
  });
}

function drawHome(graphics: Graphics, x: number, bottom: number) {
  const { left, top } = drawBuildingShell(graphics, x, bottom, 152, 154, 0xe7cfb5, 0x9e5d37, 0x000000);
  graphics.roundRect(left + 58, top + 82, 36, 72, 10).fill({ color: 0x6a4835 });
  graphics.roundRect(left + 24, top + 78, 30, 30, 8).fill({ color: 0xb2d6eb });
  graphics.roundRect(left + 98, top + 78, 30, 30, 8).fill({ color: 0xb2d6eb });
}

function drawCafe(graphics: Graphics, x: number, bottom: number) {
  const { left, top } = drawBuildingShell(graphics, x, bottom, 174, 166, 0xe5c191, 0xa85f36, 0xcc6e46);
  graphics.roundRect(left + 68, top + 84, 38, 82, 10).fill({ color: 0x674331 });
  graphics.roundRect(left + 22, top + 104, 34, 34, 10).fill({ color: 0xbee1f1 });
  graphics.roundRect(left + 118, top + 104, 34, 34, 10).fill({ color: 0xbee1f1 });
  graphics.roundRect(left + 60, top + 20, 54, 18, 999).fill({ color: 0xf4e1a9 });
}

function drawPostOffice(graphics: Graphics, x: number, bottom: number) {
  const { left, top } = drawBuildingShell(graphics, x, bottom, 178, 170, 0xcabcae, 0xad4635, 0xd3b36d);
  graphics.roundRect(left + 68, top + 86, 40, 84, 10).fill({ color: 0x615041 });
  graphics.roundRect(left + 20, top + 102, 34, 34, 10).fill({ color: 0xb7d3e7 });
  graphics.roundRect(left + 124, top + 102, 34, 34, 10).fill({ color: 0xb7d3e7 });
  graphics.roundRect(left + 18, top + 132, 26, 34, 12).fill({ color: 0xb34f38 });
  graphics.roundRect(left + 54, top + 22, 70, 20, 999).fill({ color: 0xf2d18d });
}

function drawRestaurant(graphics: Graphics, x: number, bottom: number) {
  const { left, top } = drawBuildingShell(graphics, x, bottom, 184, 172, 0xe4c39c, 0x8f3b2e, 0xcc6e43);
  graphics.roundRect(left + 72, top + 88, 40, 84, 10).fill({ color: 0x6b4630 });
  graphics.roundRect(left + 22, top + 106, 34, 34, 10).fill({ color: 0xc0e1ef });
  graphics.roundRect(left + 128, top + 106, 34, 34, 10).fill({ color: 0xc0e1ef });
  graphics.roundRect(left + 64, top + 22, 58, 18, 999).fill({ color: 0xf2d18d });
  graphics.roundRect(left + 144, top + 148, 26, 10, 999).fill({ color: 0xa96f43 });
}

function drawPetStore(graphics: Graphics, x: number, bottom: number) {
  const { left, top } = drawBuildingShell(graphics, x, bottom, 180, 170, 0xd4c7ec, 0x47749f, 0x6ca78a);
  graphics.roundRect(left + 70, top + 88, 40, 82, 10).fill({ color: 0x6a5140 });
  graphics.roundRect(left + 22, top + 106, 34, 34, 10).fill({ color: 0xc9e3ef });
  graphics.roundRect(left + 124, top + 106, 34, 34, 10).fill({ color: 0xc9e3ef });
  graphics.roundRect(left + 58, top + 22, 64, 20, 999).fill({ color: 0xf0d494 });
  graphics.roundRect(left + 146, top + 146, 22, 10, 999).fill({ color: 0xfff4db });
}

function drawWorldProp(graphics: Graphics, prop: WorldProp, x: number, stageHeight: number) {
  const bottom = prop.lane === 'front' ? stageHeight - 136 : stageHeight - 142;

  switch (prop.kind) {
    case 'tree':
      drawTree(graphics, x, bottom);
      return;
    case 'lamp':
      drawLamp(graphics, x, bottom);
      return;
    case 'bench':
      drawBench(graphics, x, bottom);
      return;
    case 'flower':
      drawFlower(graphics, x, bottom);
      return;
    case 'treat':
      drawTreatBag(graphics, x, bottom);
      return;
    case 'home':
      drawHome(graphics, x, bottom);
      return;
    case 'park':
      drawParkGate(graphics, x, bottom);
      return;
    case 'fountain':
      drawFountain(graphics, x, bottom);
      return;
    case 'cafe':
      drawCafe(graphics, x, bottom);
      return;
    case 'postOffice':
      drawPostOffice(graphics, x, bottom);
      return;
    case 'restaurant':
      drawRestaurant(graphics, x, bottom);
      return;
    case 'petStore':
      drawPetStore(graphics, x, bottom);
      return;
  }
}

export function PixiStageScene({
  stageWidth,
  stageHeight,
  progress,
  elapsed,
  velocity,
  activeLevel,
  isRaining,
  visibleProps,
  actorScene,
}: PixiStageSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const drawBackground = useCallback(
    (graphics: Graphics) => {
      const width = Math.max(stageWidth, 960);
      const height = Math.max(stageHeight, 620);
      const theme = STAGE_THEMES[activeLevel.destinationKey];
      const roadTop = height - 140;
      const curbTop = height - 172;
      const grassTop = height - 342;
      const cameraPush = Math.max(-1, Math.min(1, velocity / 132));
      const cameraLift = Math.sin(elapsed * 0.55) * 3;
      const hillShift = -((progress * 0.11) % (width * 1.2)) - cameraPush * 32;
      const houseShift = -((progress * 0.18) % (width * 0.9)) - cameraPush * 48;
      const roadShift = -((progress * 2.1) % 88) - cameraPush * 14;

      graphics.clear();
      graphics.rect(0, 0, width, height * 0.64).fill({
        color: isRaining ? 0xb9c9d4 : theme.skyTop,
      });
      graphics.rect(0, height * 0.16, width, height * 0.34).fill({
        color: isRaining ? 0xaebeca : theme.skyMid,
        alpha: 0.74,
      });
      graphics.rect(0, height * 0.38, width, height * 0.28).fill({
        color: isRaining ? 0xc8c8c2 : theme.skyBottom,
        alpha: 0.92,
      });

      graphics.circle(width * 0.16 + cameraPush * 64, height * 0.15 + cameraLift, width * 0.12).fill({
        color: isRaining ? 0xe3eef6 : theme.sun,
        alpha: isRaining ? 0.12 : 0.36,
      });
      graphics.circle(width * 0.16 + cameraPush * 74, height * 0.15 + cameraLift, width * 0.18).fill({
        color: 0xffffff,
        alpha: 0.08,
      });
      graphics.rect(0, 0, width, height).fill({
        color: isRaining ? 0x7890a4 : theme.tint,
        alpha: isRaining ? 0.08 : 0.04,
      });

      switch (activeLevel.destinationKey) {
        case 'cafe':
          drawCafeBackdrop(graphics, width, height, houseShift);
          break;
        case 'postOffice':
          drawZurichBackdrop(graphics, width, height, houseShift);
          break;
        case 'restaurant':
          drawLakeBackdrop(graphics, width, height, hillShift);
          break;
        case 'petStore':
          drawMarketBackdrop(graphics, width, height, houseShift);
          break;
        case 'park':
        case 'home':
        default:
          drawParkBackdrop(graphics, width, height, hillShift, houseShift, cameraLift, theme);
          break;
      }

      graphics.rect(0, grassTop, width, 170).fill({ color: theme.grass, alpha: 0.98 });
      for (let stripe = 0; stripe < width + 90; stripe += 52) {
        graphics.rect(stripe, grassTop + 14, 18, 156).fill({ color: theme.grassStripe, alpha: 0.08 });
      }
      graphics.rect(0, grassTop + 116, width, 54).fill({ color: theme.grassShadow, alpha: 0.08 });

      graphics.rect(0, curbTop, width, 32).fill({ color: theme.curb });
      graphics.rect(0, roadTop, width, 140).fill({ color: theme.road });
      graphics.rect(0, roadTop + 10, width, 6).fill({ color: 0xffffff, alpha: 0.14 });
      graphics.rect(0, roadTop, width, 18).fill({ color: 0xffffff, alpha: 0.06 });
      graphics.rect(0, roadTop + 82, width, 38).fill({ color: 0x000000, alpha: 0.06 });
      for (let dashX = roadShift - 90; dashX < width + 120; dashX += 88) {
        graphics.roundRect(dashX, roadTop + 66, 42, 8, 999).fill({ color: 0xf4d681, alpha: 0.95 });
      }
      graphics.rect(0, roadTop + 118, width, 24).fill({ color: 0x1b1715, alpha: 0.12 });

      drawCloud(graphics, width * 0.11 - cameraPush * 18, 78 + cameraLift * 0.28, 1.18, isRaining ? 0.28 : 0.5);
      drawCloud(graphics, width * 0.47 - cameraPush * 26, 92 + cameraLift * 0.2, 1.4, isRaining ? 0.22 : 0.44);
      drawCloud(graphics, width * 0.76 - cameraPush * 14, 74 + cameraLift * 0.24, 1.02, isRaining ? 0.2 : 0.38);
      graphics.rect(0, 0, width, height).fill({ color: 0x2a1b11, alpha: 0.03 });
    },
    [activeLevel.destinationKey, elapsed, isRaining, progress, stageHeight, stageWidth, velocity],
  );

  const drawProps = useCallback(
    (graphics: Graphics) => {
      const height = Math.max(stageHeight, 620);

      graphics.clear();
      visibleProps.forEach(({ prop, x }) => {
        drawWorldProp(graphics, prop, x, height);
      });
    },
    [stageHeight, visibleProps],
  );

  const drawActors = useCallback(
    (graphics: Graphics) => {
      drawActorScene(graphics, actorScene);
    },
    [actorScene],
  );

  return (
    <div ref={rootRef} className="pixi-stage" aria-hidden="true">
      <Application
        className="pixi-stage__app"
        resizeTo={rootRef}
        backgroundAlpha={0}
        antialias
        autoDensity
        preference="webgl"
      >
        <pixiContainer eventMode="none">
          <pixiGraphics draw={drawBackground} />
          <pixiGraphics draw={drawProps} />
          <pixiGraphics draw={drawActors} />
        </pixiContainer>
      </Application>
    </div>
  );
}
