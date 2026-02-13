import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

        {/* Last round detail */}
        {lastRound && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{'DÉTAIL MANCHE ' + rounds.length}</Text>
            {players.map((p, i) => {
              const correct = lastRound.bids[i] === lastRound.tricks[i];
              return (
                <View
                  key={i}
                  style={[styles.detailRow, i < players.length - 1 && styles.detailRowBorder]}
                >
                  <Text style={styles.detailIcon}>{p.icon}</Text>
                  <Text style={styles.detailName}>{p.name}</Text>
                  <Text style={styles.detailBid}>
                    {lastRound.bids[i]}→{lastRound.tricks[i]}
                  </Text>
                  <Text
                    style={[
                      styles.detailScore,
                      { color: correct ? Colors.positive : Colors.negative },
                    ]}
                  >
                    {lastRound.scores[i] >= 0 ? '+' : ''}{lastRound.scores[i]}
                  </Text>
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
    gap: 8,
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.goldAlpha(0.03),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.08),
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rankRowFirst: {
    backgroundColor: Colors.goldAlpha(0.1),
    borderColor: Colors.goldAlpha(0.3),
  },
  rankMedal: {
    fontSize: 14,
    width: 24,
    textAlign: 'center',
    color: Colors.goldAlpha(0.5),
  },
  rankIcon: {
    fontSize: 20,
  },
  rankName: {
    flex: 1,
    color: Colors.gold,
    fontFamily: Fonts.cinzel,
    fontSize: 14,
  },
  rankScoreContainer: {
    alignItems: 'flex-end',
  },
  rankTotal: {
    color: Colors.gold,
    fontSize: 20,
    fontFamily: Fonts.cinzelBold,
  },
  rankDelta: {
    fontSize: 10,
  },
  detailCard: {
    backgroundColor: Colors.goldAlpha(0.03),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.08),
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  detailTitle: {
    color: Colors.goldAlpha(0.5),
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAlpha(0.06),
  },
  detailIcon: {
    fontSize: 14,
  },
  detailName: {
    flex: 1,
    color: Colors.goldAlpha(0.7),
    fontSize: 12,
  },
  detailBid: {
    fontSize: 11,
    color: Colors.goldAlpha(0.4),
    marginRight: 4,
  },
  detailScore: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    gap: 10,
  },
});
