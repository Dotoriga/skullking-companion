import { BonusType } from '../types';

export const PIRATE_ICONS = ['🏴‍☠️', '⚓', '🦜', '🗡️', '💀', '🧭', '🐙', '🦈'];

export const BONUS_TYPES: BonusType[] = [
  { id: 'mermaid_by_pirate', label: 'Sirène par pirate', icon: '🧜‍♀️', value: 20, maxCount: 2 },
  { id: 'pirate_by_sk', label: 'Pirate par SK', icon: '🏴‍☠️', value: 30, maxCount: 5 },
  { id: 'sk_by_mermaid', label: 'SK par sirène', icon: '💀', value: 40, maxCount: 1 },
  { id: '14_classic', label: '14 couleur', icon: '🃏', value: 10, maxCount: 3 },
  { id: '14_black', label: '14 noir', icon: '⚫', value: 20, maxCount: 1 },
];
