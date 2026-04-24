const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

export function toOrdinal(n: number): string {
  if (n >= 1 && n <= ORDINALS.length) {
    return ORDINALS[n - 1];
  }
  return String(n);
}
