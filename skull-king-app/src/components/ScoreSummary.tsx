import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/theme';
import { Player, RoundData } from '../types';

interface Props {
  players: Player[];
  rounds: RoundData[];
}

export function ScoreSummary({ players, rounds }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (rounds.length === 0) return null;

  const totals = players.map((_, pi) =>
    rounds.reduce((s, r) => s + r.scores[pi], 0)
  );
  const sorted = players
    .map((p, i) => ({ ...p, idx: i, total: totals[i] }))
    .sort((a, b) => b.total - a.total);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.label}>SCORES</Text>
        <View style={styles.compactRow}>
          {sorted.map((p, rank) => (
            <View key={p.idx} style={styles.compactItem}>
              <Text style={styles.compactIcon}>{p.icon}</Text>
              <Text style={[styles.compactScore, rank === 0 && styles.compactScoreFirst]}>
                {p.total}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedList}>
          {sorted.map((p, rank) => {
            const lastScore = rounds[rounds.length - 1].scores[p.idx];
            return (
              <View key={p.idx} style={styles.expandedRow}>
                <Text style={styles.rank}>
                  {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                </Text>
                <Text style={styles.expandedIcon}>{p.icon}</Text>
                <Text style={styles.expandedName}>{p.name}</Text>
                <Text style={styles.expandedTotal}>{p.total}</Text>
                <Text style={[styles.expandedDelta, { color: lastScore >= 0 ? Colors.positive : Colors.negative }]}>
                  {lastScore >= 0 ? '+' : ''}{lastScore}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: Colors.goldAlpha(0.04),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.1),
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  label: {
    color: Colors.goldAlpha(0.5),
    fontSize: 11,
    letterSpacing: 1,
  },
  compactRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  compactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactIcon: {
    fontSize: 16,
  },
  compactScore: {
    color: Colors.goldAlpha(0.7),
    fontSize: 14,
    fontFamily: Fonts.cinzelBold,
  },
  compactScoreFirst: {
    color: Colors.gold,
  },
  chevron: {
    color: Colors.goldAlpha(0.4),
    fontSize: 12,
  },
  expandedList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.goldAlpha(0.06),
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
  },
  rank: {
    width: 24,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.goldAlpha(0.6),
  },
  expandedIcon: {
    fontSize: 20,
  },
  expandedName: {
    flex: 1,
    color: Colors.goldAlpha(0.8),
    fontSize: 14,
  },
  expandedTotal: {
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
    fontSize: 17,
  },
  expandedDelta: {
    fontSize: 12,
    minWidth: 34,
    textAlign: 'right',
  },
});
