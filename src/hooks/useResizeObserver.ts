import { debounce } from "lodash";
import throttle from "lodash/throttle";
import { useState, useEffect } from "react";
import { Size } from "../types";

export function useResizeObserver<T extends HTMLDivElement>(
  limitMode: "debounce" | "throttle" = "throttle",
  time = 40,
  constraints?: {
    width?: [number, number];
    height?: [number, number];
  }
): [Size | undefined, React.RefObject<T>, T] {
  const [size, setSize] = useState<Size>();
  const [node, elRef] = useState<T>();

  useEffect(() => {
    if (node) {
      const limitFn = limitMode === "throttle" ? throttle : debounce;
      const resizeObserver = new ResizeObserver(
        limitFn((entries) => {
          const entry = entries[0];
          setSize({
            width: getConstrainedValue(
              entry.contentRect.width,
              constraints?.width
            ),
            height: getConstrainedValue(
              entry.contentRect.height,
              constraints?.height
            ),
          });
        }, time)
      );

      resizeObserver.observe(node);
      return () => resizeObserver.unobserve(node);
    }
  }, [node, time, limitMode, constraints]);

  // @ts-ignore
  return [size, elRef, node];
}

function getConstrainedValue(value: number, constraints?: [number, number]) {
  if (constraints) {
    return Math.min(Math.max(value, constraints[0]), constraints[1]);
  }
  return value;
}
