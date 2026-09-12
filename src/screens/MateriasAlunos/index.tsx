import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { CardMateria } from '../../components/CardMateria/CardMateria';
import { styles } from './styles';
import { MateriaItem, TodasMateriasScreenProps } from './types';

export function TodasMateriasScreen({ onSelectMateria }: TodasMateriasScreenProps) {
  // Lista mockada baseada na imagem enviada
  const materias: MateriaItem[] = [
    {
      id: '1',
      nome: 'Estrutura de dados',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 12,
      iconName: 'database',
      iconBgColor: '#FF922B',
    },
    {
      id: '2',
      nome: 'Algoritmos',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 24,
      iconName: 'code',
      iconBgColor: '#15AABF',
    },
    {
      id: '3',
      nome: 'Inglês V',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 2,
      iconName: 'flag',
      iconBgColor: '#CC5DE8',
    },
    {
      id: '4',
      nome: 'Estrutura de dados',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 12,
      iconName: 'database',
      iconBgColor: '#FF922B',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas matérias</Text>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardMateria
            nome={item.nome}
            cursoSemestre={item.cursoSemestre}
            cardsParaRevisar={item.cardsParaRevisar}
            iconName={item.iconName}
            iconBgColor={item.iconBgColor}
            onPress={() => onSelectMateria?.(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}