import { BonusType } from '../types';

export const PIRATE_ICONS = ['🏴‍☠️', '⚓', '🦜', '🗡️', '💀', '🧭', '🐙', '🦈'];

export const BONUS_TYPES: BonusType[] = [
  { id: 'pirate', label: 'Pirate capturé', icon: '🏴‍☠️', value: 30 },
  { id: 'mermaid', label: 'Sirène (par SK)', icon: '🧜‍♀️', value: 40 },
  { id: 'skullking', label: 'Skull King capturé', icon: '💀', value: 50 },
];
