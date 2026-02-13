import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { GoldButton } from '../components/GoldButton';
import { Colors, Fonts } from '../constants/theme';
import { BONUS_TYPES } from '../constants/game';
import { Player, BonusEntry } from '../types';

interface Props {
  players: Player[];
  round: number;
  bids: number[];
  onSubmitResults: (tricks: number[], bonuses: BonusEntry[][]) => void;
  onBack: () => void;
}

export function ResultScreen({ players, round, bids, onSubmitResults, onBack }: Props) {
  const [tricks, setTricks] = useState<number[]>(players.map(() => 0));
  const [bonuses, setBonuses] = useState<BonusEntry[][]>(
    players.map(() => BONUS_TYPES.map(b => ({ ...b, count: 0 })))
  );
  const totalTricks = tricks.reduce((a, b) => a + b, 0);

  const setTrickForPlayer = (pi: number, value: number) => {
    const t = [...tricks];
    t[pi] = value;
    setTricks(t);
  };

  const toggleBonus = (pi: number, bi: number) => {
    const b = bonuses.map(p => p.map(x => ({ ...x })));
    b[pi][bi].count = b[pi][bi].count > 0 ? 0 : 1;
    setBonuses(b);
  };

  return (
    <View style={styles.container}>
      <Header
        title={`Manche ${round} — Résultats`}
        subtitle={`Plis distribués: ${totalTricks} / ${round}`}
        onBack={onBack}
      />
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {players.map((p, i) => (
          <View key={i} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerIcon}>{p.icon}</Text>
              <Text style={styles.playerName}>{p.name}</Text>
              <Text style={styles.bidInfo}>Enchère: {bids[i]}</Text>
            </View>

            <View style={styles.tricksRow}>
              <Text style={styles.tricksLabel}>Plis :</Text>
              <View style={styles.tricksButtons}>
                {Array.from({ length: round + 1 }, (_, n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setTrickForPlayer(i, n)}
                    style={[styles.trickButton, tricks[i] === n && styles.trickButtonActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.trickButtonText, tricks[i] === n && styles.trickButtonTextActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {bids[i] > 0 && (
              <View style={styles.bonusRow}>
                {BONUS_TYPES.map((bt, bi) => (
                  <TouchableOpacity
                    key={bt.id}
                    onPress={() => toggleBonus(i, bi)}
                    style={[styles.bonusButton, bonuses[i][bi].count > 0 && styles.bonusButtonActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.bonusText, bonuses[i][bi].count > 0 && styles.bonusTextActive]}>
                      {bt.icon} +{bt.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <GoldButton onPress={() => onSubmitResults(tricks, bonuses)}>
          Calculer les scores ⚡
        </GoldButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  playerCard: {
    backgroundColor: Colors.goldAlpha(0.04),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.1),
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  playerIcon: {
    fontSize: 22,
  },
  playerName: {
    flex: 1,
    color: Colors.gold,
    fontFamily: Fonts.cinzel,
    fontSize: 14,
  },
  bidInfo: {
    color: Colors.goldAlpha(0.4),
    fontSize: 11,
  },
  tricksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tricksLabel: {
    color: Colors.goldAlpha(0.5),
    fontSize: 11,
    width: 55,
  },
  tricksButtons: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  trickButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  trickButtonActive: {
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: Colors.goldAlpha(0.2),
  },
  trickButtonText: {
    fontSize: 14,
    fontFamily: Fonts.cinzel,
    color: Colors.goldAlpha(0.3),
  },
  trickButtonTextActive: {
    color: Colors.gold,
  },
  bonusRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  bonusButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.1),
  },
  bonusButtonActive: {
    borderColor: Colors.goldAlpha(0.4),
    backgroundColor: Colors.goldAlpha(0.12),
  },
  bonusText: {
    fontSize: 11,
    color: Colors.goldAlpha(0.3),
  },
  bonusTextActive: {
    color: Colors.gold,
  },
  footer: {
    padding: 20,
  },
});
