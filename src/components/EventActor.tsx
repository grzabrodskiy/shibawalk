import { CatArt, PassingDogArt } from '../art';
import type { ActiveEvent } from '../game';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface EventActorProps {
  event: ActiveEvent | null;
  stageWidth: number;
  shibaX: number;
}

export function getAnimalEncounterState(
  event: ActiveEvent | null,
  stageWidth: number,
  shibaX: number,
) {
  if (!event || (event.type !== 'cat' && event.type !== 'dog')) {
    return null;
  }

  const x = clamp(event.screenX, -160, stageWidth + 160);
  const bottom = event.type === 'cat' ? 104 : 102;
  const distanceToShiba = Math.abs(x - shibaX);
  const isApproaching = event.direction === 1 ? x < shibaX : x > shibaX;
  const isSniffing = event.type === 'dog' && event.speed <= 1;
  const facing = isSniffing ? (x > shibaX ? -1 : 1) : event.direction;
  const showCallout =
    event.type === 'cat'
      ? isApproaching && distanceToShiba > 150 && distanceToShiba < 260
      : isApproaching && distanceToShiba > 170 && distanceToShiba < 290;

  return {
    x,
    bottom,
    facing,
    isSniffing,
    showCallout,
  };
}

export function EventActor({ event, stageWidth, shibaX }: EventActorProps) {
  const encounter = getAnimalEncounterState(event, stageWidth, shibaX);

  if (!event || !encounter) {
    return null;
  }

  return (
    <div
      className={`event-actor event-actor--${event.type}`}
      style={{ left: `${encounter.x}px`, bottom: `${encounter.bottom}px` }}
      aria-hidden="true"
    >
      {encounter.showCallout ? (
        <div className={`event-callout event-callout--${event.type}`}>
          {event.type === 'cat' ? 'MEOW!' : 'BARK!'}
        </div>
      ) : null}
      {event.type === 'cat' ? (
        <CatArt facing={encounter.facing} moving stride="0.74s" />
      ) : (
        <PassingDogArt
          facing={encounter.facing}
          moving={!encounter.isSniffing}
          stride="0.96s"
        />
      )}
    </div>
  );
}
