import { useState, useRef, useLayoutEffect } from "react";
import throttle from "lodash/throttle";

export function useElementSize<T extends HTMLDivElement>(): [
  DOMRect | undefined,
  React.RefObject<T>
] {
  const [size, setSize] = useState<DOMRect>();
  const elRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (elRef.current) {
      setSize(elRef.current.getBoundingClientRect());

      const throttledResizeHandler = throttle((e: Event) => {
        if (elRef.current) {
          setSize(elRef.current.getBoundingClientRect());
        }
      }, 250);

      window.addEventListener("resize", throttledResizeHandler);
      return () => window.removeEventListener("resize", throttledResizeHandler);
    }
  }, []);

  return [size, elRef];
}
