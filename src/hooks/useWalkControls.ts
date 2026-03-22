import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Direction } from '../game';

interface UseWalkControlsOptions {
  onTreat: () => void;
  onScream: () => void;
  onReset: () => void;
}

export function useWalkControls({ onTreat, onScream, onReset }: UseWalkControlsOptions) {
  const [keyboardLeft, setKeyboardLeft] = useState(false);
  const [keyboardRight, setKeyboardRight] = useState(false);
  const [keyboardBrace, setKeyboardBrace] = useState(false);
  const [touchLeft, setTouchLeft] = useState(false);
  const [touchRight, setTouchRight] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === 'KeyA' ||
        event.code === 'KeyS' ||
        event.code === 'KeyD' ||
        event.code === 'KeyQ' ||
        event.code === 'KeyW' ||
        event.code === 'KeyE' ||
        event.code.startsWith('Arrow') ||
        event.code === 'Space'
      ) {
        event.preventDefault();
      }

      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        setKeyboardLeft(true);
      }

      if (event.code === 'KeyD' || event.code === 'ArrowRight' || event.code === 'Space') {
        setKeyboardRight(true);
      }

      if (event.code === 'KeyS' || event.code === 'ArrowDown') {
        setKeyboardBrace(true);
      }

      if (
        (event.code === 'KeyW' || event.code === 'KeyE' || event.code === 'ArrowUp') &&
        !event.repeat
      ) {
        onTreat();
      }

      if (event.code === 'KeyQ' && !event.repeat) {
        onScream();
      }

      if (event.code === 'KeyR' && !event.repeat) {
        setKeyboardLeft(false);
        setKeyboardRight(false);
        setKeyboardBrace(false);
        setTouchLeft(false);
        setTouchRight(false);
        onReset();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        setKeyboardLeft(false);
      }

      if (event.code === 'KeyD' || event.code === 'ArrowRight' || event.code === 'Space') {
        setKeyboardRight(false);
      }

      if (event.code === 'KeyS' || event.code === 'ArrowDown') {
        setKeyboardBrace(false);
      }
    };

    const handleBlur = () => {
      setKeyboardLeft(false);
      setKeyboardRight(false);
      setKeyboardBrace(false);
      setTouchLeft(false);
      setTouchRight(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onReset, onScream, onTreat]);

  const pullDirection = useMemo<Direction>(() => {
    const leftActive = keyboardLeft || touchLeft;
    const rightActive = keyboardRight || touchRight;

    if (leftActive === rightActive) {
      return 0;
    }

    return rightActive ? 1 : -1;
  }, [keyboardLeft, keyboardRight, touchLeft, touchRight]);

  const isBracing = keyboardBrace && pullDirection === 0;

  const clearPullState = useCallback(() => {
    setKeyboardLeft(false);
    setKeyboardRight(false);
    setKeyboardBrace(false);
    setTouchLeft(false);
    setTouchRight(false);
  }, []);

  const startTouchPull = useCallback((direction: Direction) => {
    setTouchLeft(direction === -1);
    setTouchRight(direction === 1);
  }, []);

  const stopTouchPull = useCallback(() => {
    setTouchLeft(false);
    setTouchRight(false);
  }, []);

  return {
    isPulling: pullDirection !== 0,
    pullDirection,
    isBracing,
    clearPullState,
    startTouchPull,
    stopTouchPull,
  };
}
