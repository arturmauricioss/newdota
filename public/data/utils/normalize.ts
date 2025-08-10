export function normalizeMetaScore(rawScore: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return parseFloat(((rawScore / maxScore) * 20 - 10).toFixed(2));
}
