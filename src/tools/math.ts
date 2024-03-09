export function min(a: number, b: number) {
  return a <= b ? a : b;
}
export function max(a: number, b: number) {
  return a >= b ? a : b;
}

export function randomRange(start: number, end: number): number {
  if (start > end) {
    let tmp = start;
    start = end;
    end = tmp;
  }
  return Math.random() * (end - start) + start;
}
