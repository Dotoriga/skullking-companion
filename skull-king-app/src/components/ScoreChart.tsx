import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line, Polyline, Circle, G } from 'react-native-svg';
import { Player, RoundData } from '../types';
import { Colors } from '../constants/theme';

interface Props {
  players: Player[];
  rounds: RoundData[];
}

export function ScoreChart({ players, rounds }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const chartW = screenWidth - 80;
  const chartH = 120;

  const cumulative = players.map((_, pi) => {
    let total = 0;
    return rounds.map(r => {
      total += r.scores[pi];
      return total;
    });
  });

  const allValues = cumulative.flat();
  const maxScore = Math.max(...allValues, 1);
  const minScore = Math.min(...allValues, 0);
  const range = Math.max(maxScore - minScore, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{'ÉVOLUTION DES SCORES'}</Text>
      <Svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <Line
            key={f}
            x1={0}
            y1={chartH * f}
            x2={chartW}
            y2={chartH * f}
            stroke={Colors.goldAlpha(0.08)}
            strokeWidth={0.5}
          />
        ))}
        {players.map((_, pi) => {
          const color = Colors.chartColors[pi % Colors.chartColors.length];
          const points = cumulative[pi]
            .map((v, ri) => {
              const x = (ri / Math.max(rounds.length - 1, 1)) * (chartW - 20) + 10;
              const y = chartH - ((v - minScore) / range) * (chartH - 20) - 10;
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <G key={pi}>
              <Polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
              {cumulative[pi].map((v, ri) => {
                const x = (ri / Math.max(rounds.length - 1, 1)) * (chartW - 20) + 10;
                const y = chartH - ((v - minScore) / range) * (chartH - 20) - 10;
                return <Circle key={ri} cx={x} cy={y} r={3} fill={color} />;
              })}
            </G>
          );
        })}
      </Svg>
      <View style={styles.legend}>
        {players.map((p, pi) => (
          <View key={pi} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: Colors.chartColors[pi % Colors.chartColors.length] },
              ]}
            />
            <Text style={styles.legendText}>{p.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.goldAlpha(0.03),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.08),
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: Colors.goldAlpha(0.5),
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: Colors.goldAlpha(0.5),
  },
});
