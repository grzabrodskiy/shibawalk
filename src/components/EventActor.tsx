import type { CSSProperties } from 'react';
import { BigDogHandlerArt, CatArt, PassingDogArt } from '../art';
import type { ActiveEvent } from '../game';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface EventActorProps {
  event: ActiveEvent | null;
  stageWidth: number;
  shibaX: number;
}

interface EncounterState {
  x: number;
  bottom: number;
  facing: -1 | 1;
  isSniffing: boolean;
  showCallout: boolean;
  shibaCallout: string | null;
}

export function getAnimalEncounterState(
  event: ActiveEvent | null,
  stageWidth: number,
  shibaX: number,
): EncounterState | null {
  if (!event || (event.type !== 'cat' && event.type !== 'dog' && event.type !== 'bigDog')) {
    return null;
  }

  const padding = event.type === 'bigDog' ? 280 : 160;
  const x = clamp(event.screenX, -padding, stageWidth + padding);
  const bottom = event.type === 'cat' ? 104 : event.type === 'bigDog' ? 98 : 102;
  const distanceToShiba = Math.abs(x - shibaX);
  const isApproaching = event.direction === 1 ? x < shibaX : x > shibaX;
  const isSniffing = event.type === 'dog' && event.speed <= 1;
  const isDeparting = !isApproaching && !isSniffing;
  const facing: -1 | 1 = isSniffing
    ? (x > shibaX ? -1 : 1)
    : event.direction === -1
      ? -1
      : 1;
  const approachWindow =
    event.type === 'cat'
      ? distanceToShiba > 150 && distanceToShiba < 260
      : event.type === 'bigDog'
        ? distanceToShiba > 120 && distanceToShiba < 320
        : distanceToShiba > 170 && distanceToShiba < 290;
  const departureWindow =
    event.type === 'cat'
      ? distanceToShiba > 118 && distanceToShiba < 210
      : event.type === 'bigDog'
        ? distanceToShiba > 96 && distanceToShiba < 250
        : distanceToShiba > 132 && distanceToShiba < 230;
  const showCallout = (isApproaching && approachWindow) || (isDeparting && departureWindow);

  return {
    x,
    bottom,
    facing,
    isSniffing,
    showCallout,
    shibaCallout: showCallout
      ? event.type === 'bigDog'
        ? (event.shibaCallout ?? 'Bork!')
        : 'YIP!'
      : null,
  };
}

function getBigDogCalloutLeft(facing: -1 | 1, role: 'dog' | 'person') {
  if (role === 'dog') {
    return facing === -1 ? '33%' : '67%';
  }

  return facing === -1 ? '79%' : '21%';
}

export function EventActor({ event, stageWidth, shibaX }: EventActorProps) {
  const encounter = getAnimalEncounterState(event, stageWidth, shibaX);

  if (!event || !encounter) {
    return null;
  }

  const actorStyle = {
    left: `${encounter.x}px`,
    bottom: `${encounter.bottom}px`,
    ['--stride' as string]:
      event.type === 'cat' ? '0.74s' : event.type === 'bigDog' ? '1.02s' : '0.96s',
  } as CSSProperties;

  return (
    <div
      className={`event-actor event-actor--${event.type}${encounter.isSniffing ? ' is-sniffing' : ' is-moving'}`}
      style={actorStyle}
      aria-hidden="true"
    >
      {encounter.showCallout && event.type !== 'bigDog' ? (
        <div className={`event-callout event-callout--${event.type}`}>
          {event.type === 'cat' ? 'MEOW!' : 'BARK!'}
        </div>
      ) : null}

      {encounter.showCallout && event.type === 'bigDog' ? (
        <>
          <div
            className="event-callout event-callout--big-dog event-callout--big-dog-dog"
            style={{ left: getBigDogCalloutLeft(encounter.facing, 'dog') }}
          >
            {event.animalCallout ?? 'Grrrr'}
          </div>
          <div
            className="event-callout event-callout--person event-callout--big-dog-person"
            style={{ left: getBigDogCalloutLeft(encounter.facing, 'person') }}
          >
            {event.personCallout ?? 'Wow!'}
          </div>
        </>
      ) : null}

      <div className="event-actor__shell">
        {event.type === 'cat' ? (
          <CatArt facing={encounter.facing} moving stride="0.74s" catCoat={event.catCoat} />
        ) : event.type === 'bigDog' ? (
          <div className={`big-dog-encounter${encounter.facing === 1 ? ' is-facing-right' : ''}`}>
            <svg className="big-dog-encounter__leash" viewBox="0 0 360 230" preserveAspectRatio="none">
              <path
                d="M266 102C245 103 223 104 206 108C187 114 172 122 155 133"
                fill="none"
                stroke="#7b5a46"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="big-dog-encounter__dog">
              <PassingDogArt facing={-1} moving stride="1.02s" dogCoat={event.dogCoat ?? 'shepherd'} />
            </div>
            <div className="big-dog-encounter__person">
              <BigDogHandlerArt
                moving
                stride="1.02s"
                ownerOutfit={event.ownerOutfit ?? 'slate'}
                ownerHaircut={event.ownerHaircut ?? 'bob'}
                ownerHeadwear={event.ownerHeadwear ?? 'none'}
              />
            </div>
          </div>
        ) : (
          <PassingDogArt
            facing={encounter.facing}
            moving={!encounter.isSniffing}
            sniffing={encounter.isSniffing}
            stride="0.96s"
            dogCoat={event.dogCoat ?? 'sand'}
          />
        )}
      </div>
    </div>
  );
}
