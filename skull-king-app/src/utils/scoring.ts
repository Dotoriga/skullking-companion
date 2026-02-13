import { BonusEntry } from '../types';

export function calculateScore(
  bid: number,
  tricks: number,
  bonuses: BonusEntry[],
  roundNum: number
): number {
  if (bid === 0) {
    return tricks === 0 ? roundNum * 10 : -(roundNum * 10);
  }
  if (bid === tricks) {
    const bonusTotal = bonuses.reduce((s, b) => s + b.value * b.count, 0);
    return bid * 20 + bonusTotal;
  }
  return -Math.abs(bid - tricks) * 10;
}
