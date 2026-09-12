import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { CardMateriaProps } from './types';

export function CardMateria({
  nome,
  cursoSemestre,
  cardsParaRevisar,
  iconName,
  iconBgColor,
  onPress,
}: CardMateriaProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Ícone com fundo dinâmico */}
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Feather name={iconName} size={22} color="#FFFFFF" />
      </View>

      {/* Textos da Matéria */}
      <View style={styles.content}>
        <Text style={styles.title}>{nome}</Text>
        <Text style={styles.subtitle}>
          {cursoSemestre} • {cardsParaRevisar} para revisar
        </Text>
      </View>

      {/* Seta para indicar navegação */}
      <Feather name="chevron-right" size={20} color="#ADB5BD" />
    </TouchableOpacity>
  );
}