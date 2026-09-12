import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { CardInsigniaDestaque } from '../../components/CardInsigniaDestaque/CardInsigniaDestaque';
import { CardInsigniaGrid } from '../../components/CardInsigniaGrid/CardInsigniaGrid';
import { styles } from './styles';
import { InsigniaItem, LojaInsigniasScreenProps } from './types';

export function LojaInsigniasScreen({
  usuarioXp = 850,
  onGoBack,
}: LojaInsigniasScreenProps) {
  // Lista de insígnias mockadas
  const [insignias, setInsignias] = useState<InsigniaItem[]>([
    {
      id: '1',
      titulo: 'Primeira Vitória',
      precoXp: 100,
      status: 'equipar',
      iconName: 'award',
      iconBgColor: '#51CF66',
    },
    {
      id: '2',
      titulo: 'Memória Foguete',
      precoXp: 500,
      status: 'comprar',
      iconName: 'zap',
      iconBgColor: '#FF6B6B',
    },
    {
      id: '3',
      titulo: 'Memória Brilhante',
      precoXp: 1000,
      status: 'comprar',
      iconName: 'star',
      iconBgColor: '#FCC419',
    },
    {
      id: '4',
      titulo: 'Memória Foguete',
      precoXp: 500,
      status: 'comprar',
      iconName: 'zap',
      iconBgColor: '#FF6B6B',
    },
    {
      id: '5',
      titulo: 'Memória Foguete',
      precoXp: 500,
      status: 'comprar',
      iconName: 'zap',
      iconBgColor: '#FF6B6B',
    },
    {
      id: '6',
      titulo: 'Memória Foguete',
      precoXp: 500,
      status: 'comprar',
      iconName: 'zap',
      iconBgColor: '#FF6B6B',
    },
  ]);

  const handleAction = (item: InsigniaItem) => {
    if (item.status === 'comprar') {
      if (usuarioXp < item.precoXp) {
        Alert.alert('XP Insuficiente', 'Você não tem pontos suficientes para esta insígnia.');
        return;
      }

      Alert.alert('Compra realizada', `Você comprou a insígnia: ${item.titulo}`);
      setInsignias((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'equipar' } : i))
      );
    } else if (item.status === 'equipar') {
      setInsignias((prev) =>
        prev.map((i) => ({
          ...i,
          status: i.id === item.id ? 'equipado' : i.status === 'equipado' ? 'equipar' : i.status,
        }))
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Topo com navegação e XP */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Feather name="arrow-left-circle" size={28} color="#212529" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Loja de Insígnias</Text>

        <View style={styles.xpBadge}>
          <FontAwesome5 name="bolt" size={13} color="#F59F00" />
          <Text style={styles.xpText}>{usuarioXp}</Text>
        </View>
      </View>

      <FlatList
        data={insignias}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <CardInsigniaDestaque
            titulo="Mestre da memorização"
            descricao="Para os mestres da memorização! Edição limitada."
            precoXp={5000}
            usuarioXp={usuarioXp}
            iconName="sun"
            iconBgColor="#FCC419"
          />
        }
        renderItem={({ item }) => (
          <CardInsigniaGrid
            titulo={item.titulo}
            precoXp={item.precoXp}
            status={item.status}
            iconName={item.iconName}
            iconBgColor={item.iconBgColor}
            onPress={() => handleAction(item)}
          />
        )}
      />
    </View>
  );
}