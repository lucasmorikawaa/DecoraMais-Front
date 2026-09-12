import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { styles } from './CardSalaStyle';
import { CardSalaProps } from './types'; 

export function CardSala({
  periodo,
  ano,
  materia,
  numAlunos,
  codigoConvite
}: CardSalaProps) {

  // Função para copiar o código de convite para a área de transferência
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(codigoConvite);
    Alert.alert('Copiado!', 'Código de convite copiado para a área de transferência.');
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Card */}
      <View style={styles.header}>
        <View>
          <Text style={styles.periodoText}>{periodo}</Text>
          <Text style={styles.anoText}>{ano}</Text>
        </View>
        <TouchableOpacity style={{ padding: 4 }}>
          <Feather name="more-vertical" size={20} color="#6C757D" />
        </TouchableOpacity>
      </View>

      {/* Badge da Matéria */}
      <View style={styles.materiaBadge}>
        <Text style={styles.materiaText}>{materia}</Text>
      </View>

      {/* Linha de Alunos */}
      <View style={styles.alunosRow}>
        <Feather name="users" size={18} color="#495057" />
        <Text style={styles.alunosText}>{numAlunos} Alunos</Text>
      </View>

      <View style={styles.divider} />

      {/* Código de Convite */}
      <Text style={styles.codigoTitle}>Código de convite:</Text>
      <View style={styles.codigoContainer}>
        <Text style={styles.codigoText}>{codigoConvite}</Text>
        <TouchableOpacity onPress={handleCopyCode} style={{ padding: 4 }}>
          <Ionicons name="copy-outline" size={22} color="#495057" />
        </TouchableOpacity>
      </View>
    </View>
  );
}