import React from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = { onLogout: () => void };

export function BotaoSair({ onLogout }: Props) {
  const confirmar = () => {
    Alert.alert('Sair da conta', 'Tem certeza de que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.botao} onPress={confirmar}>
      <Feather name="log-out" size={20} color="#E03131" />
      <Text style={styles.texto}>Sair da conta</Text>
    </TouchableOpacity>
  );
}

export default BotaoSair;

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E03131',
    backgroundColor: '#FFFFFF',
    marginTop: 32,
    marginBottom: 24,
  },
  texto: { color: '#E03131', fontSize: 16, fontWeight: '600' },
});