import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './style';
import { CardInsigniaDestaqueProps } from './types';

export function CardInsigniaDestaque({
  titulo,
  descricao,
  precoXp,
  usuarioXp,
  iconName,
  iconBgColor = '#FCC419',
  onPress,
}: CardInsigniaDestaqueProps) {
  const xpInsuficiente = usuarioXp < precoXp;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Feather name={iconName} size={28} color="#FFFFFF" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.descricao}>{descricao}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.precoContainer}>
          <FontAwesome5 name="bolt" size={12} color="#FCC419" />
          <Text style={styles.precoText}>{precoXp.toLocaleString('pt-BR')} XP</Text>
        </View>

        {xpInsuficiente ? (
          <View style={styles.badgeDisabled}>
            <Text style={styles.badgeDisabledText}>XP Insuficiente</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.badgeDisabled} onPress={onPress}>
            <Text style={styles.badgeDisabledText}>Resgatar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}