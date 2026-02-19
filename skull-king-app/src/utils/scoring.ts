import { BonusEntry } from '../types';

export function calculateScore(
  bid: number,
  tricks: number,
  bonuses: BonusEntry[],
  roundNum: number
): number {
  const bonusTotal = tricks > 0
    ? bonuses.reduce((s, b) => s + b.value * b.count, 0)
    : 0;

  if (bid === 0) {
    if (tricks === 0) return roundNum * 10;
    return -(roundNum * 10) + bonusTotal;
  }
  if (bid === tricks) {
    return bid * 20 + bonusTotal;
  }
  return -Math.abs(bid - tricks) * 10 + bonusTotal;
}
