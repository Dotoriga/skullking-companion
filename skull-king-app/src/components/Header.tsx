import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function Header({ title, subtitle, onBack }: Props) {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    backgroundColor: Colors.goldAlpha(0.1),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.2),
    borderRadius: 10,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: Colors.gold,
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.gold,
    fontSize: 18,
    fontFamily: Fonts.cinzelBold,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.goldAlpha(0.5),
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
