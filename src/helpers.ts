export function getTickValues<T>(
  values: T[],
  range: number,
  pixelsPerLabel: number
): T[] {
  const numberOfTicks = Math.floor(range / pixelsPerLabel);
  const periodOfDepthPicking = Math.ceil(values.length / numberOfTicks);

  return values.reduce<T[]>((acc, label, index) => {
    if (index % periodOfDepthPicking === 0) {
      acc.push(label);
    }
    return acc;
  }, []);
}
