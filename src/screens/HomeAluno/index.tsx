import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardMateria } from '../../components/CardMateria/CardMateria';
import { styles } from './styles';

export function HomeAluno() {
  const [codigoSala, setCodigoSala] = useState('');

  // Lista mockada de matérias para renderização
  const materias = [
    {
      id: '1',
      nome: 'Estrutura de dados',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 12,
      iconName: 'database' as const,
      iconBgColor: '#FF922B',
    },
    {
      id: '2',
      nome: 'Algoritmos',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 24,
      iconName: 'code' as const,
      iconBgColor: '#15AABF',
    },
    {
      id: '3',
      nome: 'Inglês V',
      cursoSemestre: '2º Semestre - ADS',
      cardsParaRevisar: 2,
      iconName: 'flag' as const,
      iconBgColor: '#CC5DE8',
    },
  ];

  const handleEntrarSala = () => {
    if (!codigoSala.trim()) {
      Alert.alert('Código necessário', 'Digite o código da sala para entrar.');
      return;
    }
    Alert.alert('Sucesso', `Ingressando na sala: ${codigoSala}`);
    setCodigoSala('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Topo / Header com XP e Ofensiva */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Fulano da Silva!</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>850 XP</Text>
            </View>
          </View>

          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={32} color="#FF6B00" />
            <View>
              <Text style={styles.streakText}>12</Text>
              <Text style={styles.streakSubtext}>Dias</Text>
            </View>
          </View>
        </View>

        {/* Seção das Matérias */}
        <Text style={styles.sectionTitle}>Suas matérias</Text>
        <Text style={styles.sectionSubtitle}>
          Continue aprendendo e fortalecendo sua memória.
        </Text>

        {materias.map((item) => (
          <CardMateria
            key={item.id}
            nome={item.nome}
            cursoSemestre={item.cursoSemestre}
            cardsParaRevisar={item.cardsParaRevisar}
            iconName={item.iconName}
            iconBgColor={item.iconBgColor}
            onPress={() => console.log(`Abrir matéria: ${item.nome}`)}
          />
        ))}

        <TouchableOpacity style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Ver todas matérias</Text>
        </TouchableOpacity>

        {/* Seção de Entrar na Sala */}
        <Text style={styles.sectionTitle}>Ingressar em uma sala</Text>
        <Text style={styles.sectionSubtitle}>
          Entre em uma sala para receber seus flashcards
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Coloque o código da sala aqui..."
            placeholderTextColor="#ADB5BD"
            value={codigoSala}
            onChangeText={setCodigoSala}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.enterButton} onPress={handleEntrarSala}>
            <Text style={styles.enterButtonText}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}