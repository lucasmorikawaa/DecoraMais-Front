import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from './BotaoCriarSalaStyle';

interface BotaoCriarSalaProps {
  onPress: () => void;
}

export function BotaoCriarSala({ onPress }: BotaoCriarSalaProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={{ color: '#fff', fontSize: 20 }}>+</Text>
      </View>
      <Text style={styles.text}>Criar Nova Sala</Text>
    </TouchableOpacity>
  );
}