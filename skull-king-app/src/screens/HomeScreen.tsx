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

interface Props {
  onNewGame: () => void;
  onHistory: () => void;
  historyCount: number;
}

export function HomeScreen({ onNewGame, onHistory, historyCount }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.logoArea}>
        <FloatingEmoji emoji="💀" size={72} />
      </View>
      <Text style={styles.title}>SKULL KING</Text>
      <Text style={styles.subtitle}>COMPANION</Text>

      <View style={styles.buttons}>
        <GoldButton onPress={onNewGame}>⚔️ Nouvelle partie</GoldButton>
        <GoldButton onPress={onHistory} variant="secondary">
          {`📜 Historique${historyCount > 0 ? ` (${historyCount})` : ''}`}
        </GoldButton>
      </View>

      <Text style={styles.version}>PROTOTYPE v1.0</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  logoArea: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    color: Colors.gold,
    textAlign: 'center',
    fontFamily: Fonts.cinzelBold,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.goldAlpha(0.5),
    letterSpacing: 4,
    marginTop: -8,
  },
  buttons: {
    width: '100%',
    maxWidth: 280,
    marginTop: 32,
    gap: 12,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    color: Colors.goldAlpha(0.2),
    fontSize: 10,
    letterSpacing: 1,
  },
});
