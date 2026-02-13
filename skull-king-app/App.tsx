import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { PhoneFrame } from './src/components/PhoneFrame';
import { HomeScreen } from './src/screens/HomeScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { BidScreen } from './src/screens/BidScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { ScoreBoardScreen } from './src/screens/ScoreBoardScreen';
import { EndScreen } from './src/screens/EndScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { calculateScore } from './src/utils/scoring';
import { loadGameHistory, saveGameHistory } from './src/utils/storage';
import { Player, RoundData, BonusEntry, GameHistoryEntry, ScreenName } from './src/types';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Cinzel-Regular': require('./assets/fonts/Cinzel-Regular.ttf'),
    'Cinzel-Bold': require('./assets/fonts/Cinzel-Bold.ttf'),
    'Cinzel-Black': require('./assets/fonts/Cinzel-Black.ttf'),
  });

  const [screen, setScreen] = useState<ScreenName>('home');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [bids, setBids] = useState<number[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    loadGameHistory().then(setGameHistory);
  }, []);

  // Save history when it changes
  useEffect(() => {
    if (gameHistory.length > 0) {
      saveGameHistory(gameHistory);
    }
  }, [gameHistory]);

  // Hide splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Android back button
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      const backMap: Partial<Record<ScreenName, ScreenName>> = {
        setup: 'home',
        bid: 'scores',
        result: 'bid',
        scores: 'home',
        end: 'home',
        history: 'home',
      };
      const target = backMap[screen];
      if (target) {
        setScreen(target);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [screen]);

  const startGame = useCallback((p: Player[]) => {
    setPlayers(p);
    setCurrentRound(1);
    setRounds([]);
    setScreen('bid');
  }, []);

  const submitBids = useCallback((b: number[]) => {
    setBids(b);
    setScreen('result');
  }, []);

  const submitResults = useCallback((tricks: number[], bonuses: BonusEntry[][]) => {
    const scores = players.map((_, i) =>
      calculateScore(bids[i], tricks[i], bonuses[i], currentRound)
    );
    const newRound: RoundData = {
      round: currentRound,
      bids: [...bids],
      tricks,
      bonuses,
      scores,
    };
    setRounds(prev => [...prev, newRound]);
    setCurrentRound(prev => prev + 1);
    setScreen('scores');
  }, [players, bids, currentRound]);

  const endGame = useCallback(() => {
    const totals = players.map((_, pi) => rounds.reduce((s, r) => s + r.scores[pi], 0));
    const entry: GameHistoryEntry = {
      players: players.map(p => ({ ...p })),
      totals,
      rounds: rounds.length,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setGameHistory(prev => [entry, ...prev]);
    setScreen('end');
  }, [players, rounds]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <PhoneFrame>
        {screen === 'home' && (
          <HomeScreen
            onNewGame={() => setScreen('setup')}
            onHistory={() => setScreen('history')}
            historyCount={gameHistory.length}
          />
        )}
        {screen === 'setup' && (
          <SetupScreen onBack={() => setScreen('home')} onStart={startGame} />
        )}
        {screen === 'bid' && (
          <BidScreen
            players={players}
            round={currentRound}
            onSubmitBids={submitBids}
            onBack={() => setScreen('scores')}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            players={players}
            round={currentRound}
            bids={bids}
            onSubmitResults={submitResults}
            onBack={() => setScreen('bid')}
          />
        )}
        {screen === 'scores' && (
          <ScoreBoardScreen
            players={players}
            rounds={rounds}
            currentRound={currentRound}
            onNextRound={() => setScreen('bid')}
            onEndGame={endGame}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'end' && (
          <EndScreen players={players} rounds={rounds} onHome={() => setScreen('home')} />
        )}
        {screen === 'history' && (
          <HistoryScreen history={gameHistory} onBack={() => setScreen('home')} />
        )}
      </PhoneFrame>
    </SafeAreaProvider>
  );
}
