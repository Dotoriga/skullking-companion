import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameHistoryEntry } from '../types';

const HISTORY_KEY = 'skull_king_game_history';

export async function loadGameHistory(): Promise<GameHistoryEntry[]> {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveGameHistory(history: GameHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
