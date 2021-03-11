import * as d3 from "d3";

export function getTickValues<T>(
  values: T[],
  range: number,
  pixelsPerLabel: number
): T[] {
  const numberOfTicks = Math.floor(range / pixelsPerLabel);
  const periodOfValuePicking = Math.ceil(values.length / numberOfTicks);

  return values.reduce<T[]>((acc, label, index) => {
    if (index % periodOfValuePicking === 0) {
      acc.push(label);
    }
    return acc;
  }, []);
}

export function toNumber(num: string | null | undefined): number {
  return +(num ?? "0");
}

export function removeContent(...ids: string[]) {
  ids.forEach((id) => {
    d3.select(id).selectAll("*").remove();
  });
}
