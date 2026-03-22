import { useCallback, useEffect, useRef, useState } from 'react';
import { GamePanel } from './components/GamePanel';
import {
  LEVEL_LENGTH,
  advanceGame,
  createInitialState,
  formatDistanceToPark,
  getMoodSummary,
  useScream,
  useTreat,
} from './game';
import type { GameState } from './game';
import { useElementSize } from './hooks/useElementSize';
import { useWalkControls } from './hooks/useWalkControls';

export default function App() {
  const [stageRef, stageSize] = useElementSize<HTMLDivElement>();
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const stageWidthRef = useRef(stageSize.width);
  const controlsRef = useRef({
    pullDirection: 0 as -1 | 0 | 1,
    bracing: false,
  });

  useEffect(() => {
    stageWidthRef.current = stageSize.width;
  }, [stageSize.width]);

  const handleTreat = useCallback(() => {
    setGame((current) => useTreat(current));
  }, []);

  const handleScream = useCallback(() => {
    setGame((current) => useScream(current));
  }, []);

  const handleReset = useCallback(() => {
    setGame(createInitialState(stageWidthRef.current));
  }, []);

  const {
    isPulling,
    pullDirection,
    isBracing,
    clearPullState,
    startTouchPull,
    stopTouchPull,
  } = useWalkControls({
    onTreat: handleTreat,
    onScream: handleScream,
    onReset: handleReset,
  });

  useEffect(() => {
    controlsRef.current = {
      pullDirection,
      bracing: isBracing,
    };
  }, [isBracing, pullDirection]);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      setGame((current) =>
        advanceGame(current, dt, controlsRef.current, stageWidthRef.current),
      );
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const handleManualReset = useCallback(() => {
    clearPullState();
    handleReset();
  }, [clearPullState, handleReset]);

  const moodSummary = getMoodSummary(game);
  const progressPct = Math.round((game.progress / LEVEL_LENGTH) * 100);

  return (
    <main className="app-shell">
      <GamePanel
        game={game}
        isPulling={isPulling}
        pullDirection={pullDirection}
        isBracing={isBracing}
        moodSummary={moodSummary}
        pullReserve={game.pullReserve}
        treats={game.treats}
        screamTimeLeft={game.screamTimeLeft}
        progressPct={progressPct}
        distanceToPark={formatDistanceToPark(game.progress)}
        treatVisualTimeLeft={game.treatVisualTimeLeft}
        onPullStart={startTouchPull}
        onPullEnd={stopTouchPull}
        onTreat={handleTreat}
        onScream={handleScream}
        onReset={handleManualReset}
        stageRef={stageRef}
        stageWidth={stageSize.width}
        stageHeight={stageSize.height}
      />
    </main>
  );
}
