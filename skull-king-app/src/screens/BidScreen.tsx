import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Header } from '../components/Header';
import { GoldButton } from '../components/GoldButton';
import { ScoreSummary } from '../components/ScoreSummary';
import { Colors, Fonts } from '../constants/theme';
import { Player, RoundData } from '../types';

interface Props {
  players: Player[];
  round: number;
  rounds: RoundData[];
  onSubmitBids: (bids: number[]) => void;
  onBack: () => void;
}

export function BidScreen({ players, round, rounds, onSubmitBids, onBack }: Props) {
  const [bids, setBids] = useState<number[]>(players.map(() => 0));
  const [revealed, setRevealed] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const submitBid = () => {
    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      setAllDone(true);
    }
  };

  const revealAndContinue = () => {
    setRevealed(true);
    setTimeout(() => onSubmitBids(bids), 1200);
  };

  const updateBid = (delta: number) => {
    setBids(b => {
      const n = [...b];
      n[currentPlayer] = Math.max(0, Math.min(round, n[currentPlayer] + delta));
      return n;
    });
  };

  if (!allDone) {
    const p = players[currentPlayer];
    return (
      <View style={styles.container}>
        <Header
          title={`Manche ${round}`}
          subtitle={`${round} carte${round > 1 ? 's' : ''} en main`}
          onBack={onBack}
        />
        <ScoreSummary players={players} rounds={rounds} />
        <View style={styles.blindContainer}>
          <Text style={styles.playerIcon}>{p.icon}</Text>
          <Text style={styles.playerName}>{p.name}</Text>
          <Text style={styles.question}>Combien de plis vas-tu remporter ?</Text>

          <View style={styles.bidSelector}>
            <TouchableOpacity onPress={() => updateBid(-1)} style={styles.bidButton} activeOpacity={0.7}>
              <Text style={styles.bidButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.bidDisplay}>
              <Text style={styles.bidValue}>{bids[currentPlayer]}</Text>
            </View>
            <TouchableOpacity onPress={() => updateBid(1)} style={styles.bidButton} activeOpacity={0.7}>
              <Text style={styles.bidButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.progress}>
            Joueur {currentPlayer + 1} / {players.length}
          </Text>
          <View style={styles.validateButton}>
            <GoldButton onPress={submitBid}>Valider ✓</GoldButton>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Manche ${round}`} subtitle="Enchères" onBack={onBack} />
      <ScoreSummary players={players} rounds={rounds} />
      <View style={styles.revealContainer}>
        <Text style={styles.revealLabel}>
          {revealed ? 'ENCHÈRES RÉVÉLÉES' : 'PRÊTS À RÉVÉLER ?'}
        </Text>
        {players.map((p, i) => (
          <RevealRow key={i} player={p} bid={bids[i]} revealed={revealed} index={i} />
        ))}
      </View>
      <View style={styles.footer}>
        {!revealed ? (
          <GoldButton onPress={revealAndContinue}>Révéler les enchères 🎭</GoldButton>
        ) : (
          <Text style={styles.playHint}>Jouez la manche...</Text>
        )}
      </View>
    </View>
  );
}

function RevealRow({ player, bid, revealed, index }: {
  player: Player;
  bid: number;
  revealed: boolean;
  index: number;
}) {
  const opacity = useSharedValue(0.7);
  const scale = useSharedValue(0.98);

  useEffect(() => {
    if (revealed) {
      opacity.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
      scale.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
    }
  }, [revealed]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.revealRow, animatedStyle]}>
      <Text style={styles.revealIcon}>{player.icon}</Text>
      <Text style={styles.revealName}>{player.name}</Text>
      <View style={[styles.bidBadge, revealed && styles.bidBadgeRevealed]}>
        <Text style={[styles.bidBadgeText, revealed && styles.bidBadgeTextRevealed]}>
          {revealed ? bid : '?'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blindContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 24,
  },
  playerIcon: {
    fontSize: 60,
  },
  playerName: {
    color: Colors.gold,
    fontSize: 26,
    fontFamily: Fonts.cinzel,
    textAlign: 'center',
  },
  question: {
    color: Colors.goldAlpha(0.6),
    fontSize: 15,
    letterSpacing: 1,
  },
  bidSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 12,
  },
  bidButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.goldAlpha(0.12),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidButtonText: {
    fontSize: 30,
    color: Colors.gold,
  },
  bidDisplay: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.goldAlpha(0.35),
    backgroundColor: Colors.goldAlpha(0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidValue: {
    fontSize: 44,
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
  },
  progress: {
    color: Colors.goldAlpha(0.4),
    fontSize: 14,
  },
  validateButton: {
    width: '100%',
    maxWidth: 280,
    marginTop: 8,
  },
  revealContainer: {
    flex: 1,
    padding: 20,
    gap: 14,
    justifyContent: 'center',
  },
  revealLabel: {
    color: Colors.goldAlpha(0.6),
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  revealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.goldAlpha(0.06),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.15),
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  revealIcon: {
    fontSize: 30,
  },
  revealName: {
    flex: 1,
    color: Colors.gold,
    fontFamily: Fonts.cinzel,
    fontSize: 18,
  },
  bidBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.goldAlpha(0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidBadgeRevealed: {
    backgroundColor: Colors.gold,
  },
  bidBadgeText: {
    fontSize: 20,
    color: Colors.goldAlpha(0.4),
    fontFamily: Fonts.cinzelBold,
  },
  bidBadgeTextRevealed: {
    fontSize: 24,
    color: Colors.bgPrimary,
  },
  footer: {
    padding: 20,
  },
  playHint: {
    color: Colors.goldAlpha(0.5),
    fontSize: 15,
    textAlign: 'center',
  },
});
