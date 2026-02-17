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
  onResumeGame?: () => void;
  onHistory: () => void;
  historyCount: number;
}

export function HomeScreen({ onNewGame, onResumeGame, onHistory, historyCount }: Props) {
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
        <FloatingEmoji emoji="💀" size={90} />
      </View>
      <Text style={styles.title}>SKULL KING</Text>
      <Text style={styles.subtitle}>COMPANION</Text>

      <View style={styles.buttons}>
        {onResumeGame && (
          <GoldButton onPress={onResumeGame}>▶️ Reprendre la partie</GoldButton>
        )}
        <GoldButton onPress={onNewGame} variant={onResumeGame ? 'secondary' : 'primary'}>
          ⚔️ Nouvelle partie
        </GoldButton>
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
    fontSize: 40,
    color: Colors.gold,
    textAlign: 'center',
    fontFamily: Fonts.cinzelBold,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.goldAlpha(0.6),
    letterSpacing: 4,
    marginTop: -8,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    marginTop: 32,
    gap: 16,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    color: Colors.goldAlpha(0.3),
    fontSize: 12,
    letterSpacing: 1,
  },
});
