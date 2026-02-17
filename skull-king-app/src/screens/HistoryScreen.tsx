import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { Colors, Fonts } from '../constants/theme';
import { GameHistoryEntry } from '../types';

interface Props {
  history: GameHistoryEntry[];
  onBack: () => void;
}

export function HistoryScreen({ history, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Header
        title="Historique"
        subtitle={`${history.length} partie${history.length > 1 ? 's' : ''}`}
        onBack={onBack}
      />
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune partie jouée.</Text>
            <Text style={styles.emptyText}>Lance-toi à l'abordage !</Text>
          </View>
        ) : (
          history.map((g, gi) => {
            const sorted = g.players
              .map((p, i) => ({ ...p, total: g.totals[i] }))
              .sort((a, b) => b.total - a.total);
            return (
              <View key={gi} style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gameDate}>{g.date}</Text>
                  <Text style={styles.gameRounds}>{g.rounds} manches</Text>
                </View>
                {sorted.map((p, i) => (
                  <View key={i} style={styles.playerRow}>
                    <Text style={styles.medal}>{i === 0 ? '🥇' : ''}</Text>
                    <Text style={styles.playerIcon}>{p.icon}</Text>
                    <Text style={styles.playerName}>{p.name}</Text>
                    <Text style={styles.playerScore}>{p.total}</Text>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
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
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.goldAlpha(0.4),
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: Colors.goldAlpha(0.06),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.12),
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameDate: {
    color: Colors.goldAlpha(0.6),
    fontSize: 14,
  },
  gameRounds: {
    color: Colors.goldAlpha(0.4),
    fontSize: 14,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  medal: {
    fontSize: 16,
    width: 24,
  },
  playerIcon: {
    fontSize: 20,
  },
  playerName: {
    flex: 1,
    color: Colors.goldAlpha(0.8),
    fontSize: 16,
  },
  playerScore: {
    color: Colors.gold,
    fontFamily: Fonts.cinzelBold,
    fontSize: 18,
  },
});
