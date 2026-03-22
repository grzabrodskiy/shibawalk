import type { WorldProp } from '../game';

interface WorldObjectProps {
  prop: WorldProp;
  x: number;
  collected: boolean;
}

export function WorldObject({ prop, x, collected }: WorldObjectProps) {
  const laneClass = prop.lane === 'front' ? 'world-object--front' : 'world-object--back';

  if (prop.kind === 'treat' && collected) {
    return null;
  }

  return (
    <div
      className={`world-object world-object--${prop.kind} ${laneClass}`}
      style={{ left: `${x}px` }}
      aria-hidden="true"
    >
      {prop.kind === 'tree' && (
        <>
          <span className="tree__canopy tree__canopy--back" />
          <span className="tree__canopy tree__canopy--front" />
          <span className="tree__trunk" />
        </>
      )}
      {prop.kind === 'lamp' && (
        <>
          <span className="lamp__pole" />
          <span className="lamp__arm" />
          <span className="lamp__glow" />
        </>
      )}
      {prop.kind === 'bench' && (
        <>
          <span className="bench__seat" />
          <span className="bench__back" />
          <span className="bench__leg bench__leg--left" />
          <span className="bench__leg bench__leg--right" />
        </>
      )}
      {prop.kind === 'flower' && (
        <>
          <span className="flower__stem" />
          <span className="flower__petal flower__petal--1" />
          <span className="flower__petal flower__petal--2" />
          <span className="flower__petal flower__petal--3" />
          <span className="flower__petal flower__petal--4" />
        </>
      )}
      {prop.kind === 'home' && (
        <>
          <span className="home__body" />
          <span className="home__roof" />
          <span className="home__door" />
          <span className="home__window home__window--left" />
          <span className="home__window home__window--right" />
        </>
      )}
      {prop.kind === 'park' && (
        <>
          <span className="park__post park__post--left" />
          <span className="park__post park__post--right" />
          <span className="park__arch" />
          <span className="park__path" />
        </>
      )}
      {prop.kind === 'fountain' && (
        <>
          <span className="fountain__basin fountain__basin--back" />
          <span className="fountain__stem" />
          <span className="fountain__bowl" />
          <span className="fountain__jet" />
          <span className="fountain__basin fountain__basin--front" />
        </>
      )}
      {prop.kind === 'cafe' && (
        <>
          <span className="cafe__body" />
          <span className="cafe__roof" />
          <span className="cafe__awning" />
          <span className="cafe__door" />
          <span className="cafe__window cafe__window--left" />
          <span className="cafe__window cafe__window--right" />
          <span className="cafe__sign" />
        </>
      )}
      {prop.kind === 'postOffice' && (
        <>
          <span className="post-office__body" />
          <span className="post-office__roof" />
          <span className="post-office__door" />
          <span className="post-office__window post-office__window--left" />
          <span className="post-office__window post-office__window--right" />
          <span className="post-office__sign" />
          <span className="post-office__mailbox" />
        </>
      )}
      {prop.kind === 'treat' && (
        <>
          <span className="treat__bag" />
          <span className="treat__label" />
        </>
      )}
    </div>
  );
}
