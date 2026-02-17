import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameHistoryEntry, GameState } from '../types';

const HISTORY_KEY = 'skull_king_game_history';
const GAME_STATE_KEY = 'skull_king_active_game';

export async function loadGameHistory(): Promise<GameHistoryEntry[]> {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveGameHistory(history: GameHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function loadGameState(): Promise<GameState | null> {
  const json = await AsyncStorage.getItem(GAME_STATE_KEY);
  return json ? JSON.parse(json) : null;
}

export async function saveGameState(state: GameState): Promise<void> {
  await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export async function clearGameState(): Promise<void> {
  await AsyncStorage.removeItem(GAME_STATE_KEY);
}
