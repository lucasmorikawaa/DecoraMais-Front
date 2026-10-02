import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardMateria } from '../../components/CardMateria/CardMateria';
import { SecaoIngressarSala } from '../../components/SecaoIngressarSala'; // Ajuste o caminho da importação
import { api } from '../../services/api'; 
import { styles } from './styles';

export function HomeAluno() {
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

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

  // Busca as informações do aluno autenticado no Spring Boot
  const carregarDadosAluno = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/me');
      
      setNomeUsuario(response.data.nome || 'Aluno');
      setStreak(response.data.ofensiva || response.data.streak || 0); 
      setXp(response.data.xp || 0);
    } catch (error: any) {
      console.log('Erro ao carregar dados do aluno:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível carregar as informações do perfil.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosAluno();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Topo / Header com XP e Ofensiva dinâmicos */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {nomeUsuario}!</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>{xp} XP</Text>
            </View>
          </View>

          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={32} color="#FF6B00" />
            <View>
              <Text style={styles.streakText}>{streak}</Text>
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

        {/* Componente Modular de Ingressar em Sala */}
        <SecaoIngressarSala />

      </ScrollView>
    </View>
  );
}