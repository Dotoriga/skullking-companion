export interface Player {
  name: string;
  icon: string;
}

export interface BonusType {
  id: string;
  label: string;
  icon: string;
  value: number;
  maxCount: number;
}

export interface BonusEntry extends BonusType {
  count: number;
}

export interface RoundData {
  round: number;
  bids: number[];
  tricks: number[];
  bonuses: BonusEntry[][];
  scores: number[];
}

export interface GameHistoryEntry {
  players: Player[];
  totals: number[];
  rounds: number;
  date: string;
}

export type ScreenName = 'home' | 'setup' | 'bid' | 'result' | 'scores' | 'end' | 'history';

export interface GameState {
  players: Player[];
  currentRound: number;
  rounds: RoundData[];
  bids: number[];
  screen: ScreenName;
}
