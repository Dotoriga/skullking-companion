import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { GoldButton } from '../components/GoldButton';
import { Colors, Fonts } from '../constants/theme';
import { PIRATE_ICONS } from '../constants/game';
import { Player } from '../types';

interface Props {
  onBack: () => void;
  onStart: (players: Player[]) => void;
}

export function SetupScreen({ onBack, onStart }: Props) {
  const [players, setPlayers] = useState<Player[]>([
    { name: '', icon: PIRATE_ICONS[0] },
    { name: '', icon: PIRATE_ICONS[1] },
  ]);

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, { name: '', icon: PIRATE_ICONS[players.length % PIRATE_ICONS.length] }]);
    }
  };

  const removePlayer = (i: number) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i));
  };

  const updateName = (i: number, name: string) => {
    const p = [...players];
    p[i] = { ...p[i], name };
    setPlayers(p);
  };

  const cycleIcon = (i: number) => {
    const p = [...players];
    const cur = PIRATE_ICONS.indexOf(p[i].icon);
    p[i] = { ...p[i], icon: PIRATE_ICONS[(cur + 1) % PIRATE_ICONS.length] };
    setPlayers(p);
  };

  const canStart = players.every(p => p.name.trim().length > 0);

  return (
    <View style={styles.container}>
      <Header
        title="Équipage"
        subtitle={`${players.length} joueurs · 10 manches`}
        onBack={onBack}
      />
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {players.map((p, i) => (
          <View key={i} style={styles.playerRow}>
            <TouchableOpacity onPress={() => cycleIcon(i)} style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconText}>{p.icon}</Text>
            </TouchableOpacity>
            <TextInput
              value={p.name}
              onChangeText={text => updateName(i, text)}
              placeholder={`Joueur ${i + 1}`}
              placeholderTextColor={Colors.goldAlpha(0.3)}
              style={styles.input}
            />
            {players.length > 2 && (
              <TouchableOpacity onPress={() => removePlayer(i)} style={styles.removeButton} activeOpacity={0.7}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {players.length < 8 && (
          <TouchableOpacity onPress={addPlayer} style={styles.addButton} activeOpacity={0.7}>
            <Text style={styles.addText}>+ Ajouter un joueur</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <GoldButton onPress={() => onStart(players)} disabled={!canStart}>
          Larguer les amarres !
        </GoldButton>
      </View>
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
    gap: 12,
    paddingBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.goldAlpha(0.06),
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.15),
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldAlpha(0.25),
    backgroundColor: Colors.goldAlpha(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  input: {
    flex: 1,
    color: Colors.gold,
    fontSize: 18,
    fontFamily: Fonts.cinzel,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dangerAlpha(0.15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: Colors.danger,
    fontSize: 16,
  },
  addButton: {
    padding: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.goldAlpha(0.25),
    alignItems: 'center',
  },
  addText: {
    color: Colors.goldAlpha(0.5),
    fontSize: 16,
  },
  footer: {
    padding: 20,
  },
});
