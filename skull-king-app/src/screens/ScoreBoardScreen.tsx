import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { GoldButton } from '../components/GoldButton';
import { ScoreChart } from '../components/ScoreChart';
import { Colors, Fonts } from '../constants/theme';
import { Player, RoundData } from '../types';

interface Props {
  players: Player[];
  rounds: RoundData[];
  currentRound: number;
  onNextRound: () => void;
  onEndGame: () => void;
  onBack: () => void;
}

export function ScoreBoardScreen({ players, rounds, currentRound, onNextRound, onEndGame, onBack }: Props) {
  const [expandedRound, setExpandedRound] = useState<number | null>(rounds.length > 0 ? rounds.length - 1 : null);

  const cumulative = players.map((_, pi) => {
    let total = 0;
    return rounds.map(r => {
      total += r.scores[pi];
      return total;
    });
  });
  const totals = cumulative.map(c => c[c.length - 1] || 0);
  const sorted = players
    .map((p, i) => ({ ...p, idx: i, total: totals[i] }))
    .sort((a, b) => b.total - a.total);

  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;

  return (
    <View style={styles.container}>
      <Header
        title="Tableau des scores"
        subtitle={`Après ${rounds.length} manche${rounds.length > 1 ? 's' : ''}`}
        onBack={onBack}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Ranking */}
        <View style={styles.ranking}>
          {sorted.map((p, rank) => {
            const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '';
            const lastRoundScore = lastRound ? lastRound.scores[p.idx] : 0;
            return (
              <View
                key={p.idx}
                style={[styles.rankRow, rank === 0 && styles.rankRowFirst]}
              >
                <Text style={styles.rankMedal}>{medal || `${rank + 1}.`}</Text>
                <Text style={styles.rankIcon}>{p.icon}</Text>
                <Text style={styles.rankName}>{p.name}</Text>
                <View style={styles.rankScoreContainer}>
                  <Text style={styles.rankTotal}>{p.total}</Text>
                  <Text
                    style={[
                      styles.rankDelta,
                      { color: lastRoundScore >= 0 ? Colors.positive : Colors.negative },
                    ]}
                  >
                    {lastRoundScore >= 0 ? '+' : ''}{lastRoundScore}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Chart */}
        {rounds.length > 1 && <ScoreChart players={players} rounds={rounds} />}

        {/* All rounds history */}
        {rounds.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>HISTORIQUE DES MANCHES</Text>
            {[...rounds].reverse().map((r, reverseIdx) => {
              const ri = rounds.length - 1 - reverseIdx;
              const isExpanded = expandedRound === ri;
              return (
                <View key={ri} style={styles.detailCard}>
                  <TouchableOpacity
                    onPress={() => setExpandedRound(isExpanded ? null : ri)}
                    style={styles.detailHeader}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailTitle}>{'MANCHE ' + r.round}</Text>
                    <Text style={styles.detailChevron}>{isExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {isExpanded && <View style={styles.detailSpacer} />}
                  {isExpanded && players.map((p, i) => {
                    const correct = r.bids[i] === r.tricks[i];
                    return (
                      <View
                        key={i}
                        style={[styles.detailRow, i < players.length - 1 && styles.detailRowBorder]}
                      >
                        <Text style={styles.detailIcon}>{p.icon}</Text>
                        <Text style={styles.detailName}>{p.name}</Text>
                        <Text style={styles.detailBid}>
                          {r.bids[i]}→{r.tricks[i]}
                        </Text>
                        <Text
                          style={[
                            styles.detailScore,
                            { color: correct ? Colors.positive : Colors.negative },
                          ]}
                        >
                          {r.scores[i] >= 0 ? '+' : ''}{r.scores[i]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentRound <= 10 ? (
          <GoldButton onPress={onNextRound}>{`Manche ${currentRound} →`}</GoldButton>
        ) : (
          <GoldButton onPress={onEndGame}>🏆 Fin de partie</GoldButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  ranking: {
    gap: 10,
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.goldAlpha(0.05),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.12),
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rankRowFirst: {
    backgroundColor: Colors.goldAlpha(0.14),
    borderColor: Colors.goldAlpha(0.35),
  },
  rankMedal: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
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
  rankScoreContainer: {
    alignItems: 'flex-end',
  },
  rankTotal: {
    color: Colors.gold,
    fontSize: 26,
    fontFamily: Fonts.cinzelBold,
  },
  rankDelta: {
    fontSize: 13,
  },
  historySection: {
    marginBottom: 16,
    gap: 8,
  },
  historySectionTitle: {
    color: Colors.goldAlpha(0.5),
    fontSize: 13,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  detailCard: {
    backgroundColor: Colors.goldAlpha(0.05),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.12),
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    color: Colors.goldAlpha(0.7),
    fontSize: 14,
    fontFamily: Fonts.cinzelBold,
    letterSpacing: 1,
  },
  detailChevron: {
    color: Colors.goldAlpha(0.4),
    fontSize: 12,
  },
  detailSpacer: {
    height: 1,
    backgroundColor: Colors.goldAlpha(0.08),
    marginTop: 10,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAlpha(0.08),
  },
  detailIcon: {
    fontSize: 18,
  },
  detailName: {
    flex: 1,
    color: Colors.goldAlpha(0.8),
    fontSize: 15,
  },
  detailBid: {
    fontSize: 14,
    color: Colors.goldAlpha(0.5),
    marginRight: 4,
  },
  detailScore: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'right',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    gap: 10,
  },
});
