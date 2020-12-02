export function inRange(x: number, a: number, b: number) {
  return a <= x && x <= b;
}

export function minBy<T>(list: T[], mapper: (d: T) => number): T {
  const tempMap = new Map<number, T>();

  const mapValues = list.map(d => {
    const n = mapper(d);
    tempMap.set(n, d);

    return n;
  });

  return tempMap.get(Math.min(...mapValues))!;
}
