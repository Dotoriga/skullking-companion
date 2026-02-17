import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { GoldButton } from '../components/GoldButton';
import { ScoreSummary } from '../components/ScoreSummary';
import { Colors, Fonts } from '../constants/theme';
import { BONUS_TYPES } from '../constants/game';
import { Player, BonusEntry, RoundData } from '../types';

interface Props {
  players: Player[];
  round: number;
  rounds: RoundData[];
  bids: number[];
  onSubmitResults: (tricks: number[], bonuses: BonusEntry[][]) => void;
  onBack: () => void;
}

export function ResultScreen({ players, round, rounds, bids, onSubmitResults, onBack }: Props) {
  const [tricks, setTricks] = useState<number[]>(players.map(() => 0));
  const [bonuses, setBonuses] = useState<BonusEntry[][]>(
    players.map(() => BONUS_TYPES.map(b => ({ ...b, count: 0 })))
  );
  const totalTricks = tricks.reduce((a, b) => a + b, 0);
  const isValid = totalTricks === round;

  const setTrickForPlayer = (pi: number, value: number) => {
    const t = [...tricks];
    t[pi] = value;
    setTricks(t);
  };

  const cycleBonus = (pi: number, bi: number) => {
    const b = bonuses.map(p => p.map(x => ({ ...x })));
    const max = BONUS_TYPES[bi].maxCount;
    b[pi][bi].count = (b[pi][bi].count + 1) % (max + 1);
    setBonuses(b);
  };

  return (
    <View style={styles.container}>
      <Header
        title={`Manche ${round} — Résultats`}
        subtitle={`Plis distribués: ${totalTricks} / ${round}`}
        onBack={onBack}
      />
      <ScoreSummary players={players} rounds={rounds} />
      {!isValid && totalTricks > 0 && (
        <View style={styles.warningBar}>
          <Text style={styles.warningText}>
            {totalTricks < round
              ? `Il manque ${round - totalTricks} pli${round - totalTricks > 1 ? 's' : ''}`
              : `${totalTricks - round} pli${totalTricks - round > 1 ? 's' : ''} en trop`}
          </Text>
        </View>
      )}
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
                {BONUS_TYPES.map((bt, bi) => {
                  const count = bonuses[i][bi].count;
                  return (
                    <TouchableOpacity
                      key={bt.id}
                      onPress={() => cycleBonus(i, bi)}
                      style={[styles.bonusButton, count > 0 && styles.bonusButtonActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.bonusText, count > 0 && styles.bonusTextActive]}>
                        {bt.icon} {count > 1 ? `×${count} ` : ''}+{bt.value * (count || 1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <GoldButton onPress={() => onSubmitResults(tricks, bonuses)} disabled={!isValid}>
          {isValid ? 'Calculer les scores ⚡' : `Total: ${totalTricks}/${round}`}
        </GoldButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warningBar: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: Colors.dangerAlpha(0.15),
    borderWidth: 1,
    borderColor: Colors.dangerAlpha(0.3),
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  warningText: {
    color: Colors.danger,
    fontSize: 13,
    fontFamily: Fonts.cinzelBold,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  playerCard: {
    backgroundColor: Colors.goldAlpha(0.06),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.15),
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  playerIcon: {
    fontSize: 28,
  },
  playerName: {
    flex: 1,
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
    fontSize: 17,
  },
  bidInfo: {
    color: Colors.goldAlpha(0.6),
    fontSize: 13,
  },
  tricksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tricksLabel: {
    color: Colors.goldAlpha(0.7),
    fontSize: 14,
    width: 50,
  },
  tricksButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  trickButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  trickButtonActive: {
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: Colors.goldAlpha(0.25),
  },
  trickButtonText: {
    fontSize: 17,
    fontFamily: Fonts.cinzelBold,
    color: Colors.goldAlpha(0.4),
  },
  trickButtonTextActive: {
    color: Colors.gold,
  },
  bonusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  bonusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.15),
  },
  bonusButtonActive: {
    borderColor: Colors.goldAlpha(0.5),
    backgroundColor: Colors.goldAlpha(0.15),
  },
  bonusText: {
    fontSize: 14,
    color: Colors.goldAlpha(0.4),
  },
  bonusTextActive: {
    color: Colors.gold,
  },
  footer: {
    padding: 20,
  },
});
