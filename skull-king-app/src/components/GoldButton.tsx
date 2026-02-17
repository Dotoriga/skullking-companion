import React from 'react';
import { View, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../constants/theme';

interface Props {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  small?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function GoldButton({ children, onPress, disabled, small, variant = 'primary' }: Props) {
  const isPrimary = variant === 'primary';

  const containerStyle: ViewStyle = {
    borderRadius: 12,
    overflow: 'hidden',
    opacity: disabled ? 0.4 : 1,
    alignSelf: small ? 'flex-start' : 'stretch',
  };

  const innerStyle: ViewStyle = {
    paddingVertical: small ? 10 : 16,
    paddingHorizontal: small ? 20 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isPrimary
      ? Colors.goldLight
      : variant === 'danger'
        ? Colors.dangerAlpha(0.3)
        : Colors.goldAlpha(0.3),
    backgroundColor: isPrimary
      ? undefined
      : variant === 'danger'
        ? Colors.dangerAlpha(0.15)
        : Colors.goldAlpha(0.08),
  };

  const textStyle = {
    fontFamily: Fonts.cinzelBold,
    fontSize: small ? 14 : 17,
    letterSpacing: 1.5,
    color: isPrimary
      ? Colors.bgPrimary
      : variant === 'danger'
        ? Colors.danger
        : Colors.gold,
  };

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={containerStyle}
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldDark, Colors.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[innerStyle, { borderWidth: 0 }]}
        >
          <Text style={textStyle}>{children.toUpperCase()}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={containerStyle}
    >
      <View style={innerStyle}>
        <Text style={textStyle}>{children.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

