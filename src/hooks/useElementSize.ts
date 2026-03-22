import { useLayoutEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 960, height: 640 });

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;
    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: rect.width || 960,
        height: rect.height || 640,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
