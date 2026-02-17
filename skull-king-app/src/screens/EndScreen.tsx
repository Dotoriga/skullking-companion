import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { GoldButton } from '../components/GoldButton';
import { FloatingEmoji } from '../components/FloatingEmoji';
import { Colors, Fonts } from '../constants/theme';
import { Player, RoundData } from '../types';

interface Props {
  players: Player[];
  rounds: RoundData[];
  onHome: () => void;
}

export function EndScreen({ players, rounds, onHome }: Props) {
  const totals = players.map((_, pi) => rounds.reduce((s, r) => s + r.scores[pi], 0));
  const sorted = players
    .map((p, i) => ({ ...p, idx: i, total: totals[i] }))
    .sort((a, b) => b.total - a.total);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(200, withTiming(0, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.victoryLabel}>VICTOIRE</Text>
        <FloatingEmoji emoji="🏆" size={72} />
        <Text style={styles.winnerName}>{sorted[0].name}</Text>
        <Text style={styles.winnerScore}>{sorted[0].total} pts</Text>

        <View style={styles.rankingList}>
          {sorted.map((p, rank) => (
            <RankRow key={p.idx} player={p} rank={rank} />
          ))}
        </View>
      </Animated.View>
      <View style={styles.footer}>
        <GoldButton onPress={onHome} variant="secondary">Accueil</GoldButton>
      </View>
    </View>
  );
}

function RankRow({ player, rank }: { player: Player & { idx: number; total: number }; rank: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(300 + rank * 100, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(300 + rank * 100, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`;

  return (
    <Animated.View
      style={[
        styles.rankRow,
        rank === 0 && styles.rankRowFirst,
        animatedStyle,
      ]}
    >
      <Text style={styles.rankMedal}>{medal}</Text>
      <Text style={styles.rankIcon}>{player.icon}</Text>
      <Text style={styles.rankName}>{player.name}</Text>
      <Text style={styles.rankScore}>{player.total}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  victoryLabel: {
    fontSize: 16,
    color: Colors.goldAlpha(0.5),
    letterSpacing: 3,
  },
  winnerName: {
    fontSize: 36,
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
  },
  winnerScore: {
    fontSize: 44,
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
  },
  rankingList: {
    width: '100%',
    marginTop: 24,
    gap: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.goldAlpha(0.05),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.1),
  },
  rankRowFirst: {
    backgroundColor: Colors.goldAlpha(0.15),
    borderColor: Colors.goldAlpha(0.35),
  },
  rankMedal: {
    width: 30,
    textAlign: 'center',
    fontSize: 18,
    color: Colors.goldAlpha(0.6),
  },
  rankIcon: {
    fontSize: 26,
  },
  rankName: {
    flex: 1,
    color: Colors.gold,
    fontFamily: Fonts.cinzel,
    fontSize: 17,
  },
  rankScore: {
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
    fontSize: 24,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    gap: 10,
  },
});
