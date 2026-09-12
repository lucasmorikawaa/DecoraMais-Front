import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './style';
import { CardInsigniaGridProps } from './types';

export function CardInsigniaGrid({
  titulo,
  precoXp,
  status,
  iconName,
  iconBgColor = '#FF6B6B',
  onPress,
}: CardInsigniaGridProps) {
  const getButtonStyles = () => {
    switch (status) {
      case 'comprar':
        return { style: styles.btnComprar, text: 'Comprar', disabled: false };
      case 'equipar':
        return { style: styles.btnEquipar, text: 'Equipar', disabled: false };
      case 'equipado':
        return { style: styles.btnEquipado, text: 'Equipado', disabled: true };
      case 'insuficiente':
      default:
        return { style: styles.btnDisabled, text: 'Comprar', disabled: true };
    }
  };

  const btnConfig = getButtonStyles();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Feather name={iconName} size={26} color="#FFFFFF" />
      </View>

      <Text style={styles.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      <View style={styles.precoContainer}>
        <FontAwesome5 name="bolt" size={11} color="#FCC419" />
        <Text style={styles.precoText}>{precoXp.toLocaleString('pt-BR')}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, btnConfig.style]}
        onPress={onPress}
        disabled={btnConfig.disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            status === 'equipado' && styles.buttonTextEquipado,
          ]}
        >
          {btnConfig.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}