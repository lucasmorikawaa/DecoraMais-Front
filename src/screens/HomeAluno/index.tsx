import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SecaoIngressarSala } from '../../components/SecaoIngressarSala';
import { api } from '../../services/api';
import { salaService } from '../../services/sala';
import { styles } from './styles';
import { SessaoFlashcards } from '../FlashCardRevisao';

type SalaAluno = {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
  professorNome?: string | null;
};

const CORES = ['#FF922B', '#15AABF', '#CC5DE8', '#51CF66', '#FF6B6B', '#339AF0'];

export function HomeAluno() {
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [cardsHoje, setCardsHoje] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(5);
  const [salas, setSalas] = useState<SalaAluno[]>([]);

  // Somente as salas em que o aluno logado está vinculado (GET /salas/minhas)
  const carregarSalas = useCallback(async () => {
    try {
      const lista = await salaService.listarMinhasSalas();
      setSalas(lista);
    } catch (error: any) {
      console.log('Erro ao carregar salas do aluno:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.mensagem || 'Não foi possível carregar suas salas.'
      );
    }
  }, []);

  const carregarTudo = useCallback(async () => {
    try {
      const response = await api.get('/usuarios/me');
      setNomeUsuario(response.data.nome || 'Aluno');
      setStreak(response.data.ofensiva ?? 0);
      setXp(response.data.xp ?? 0);
      setCardsHoje(response.data.cardsHoje ?? 0);
      setMetaDiaria(response.data.metaDiaria ?? 5);
    } catch (error: any) {
      console.log('Erro ao carregar dados do aluno:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.mensagem || 'Não foi possível carregar as informações do perfil.'
      );
    }
    await carregarSalas();
  }, [carregarSalas]);

  // Recarrega toda vez que o aluno volta para esta aba
  // (ex.: depois de estudar, o streak e o XP aparecem atualizados)
  useFocusEffect(
    useCallback(() => {
      carregarTudo().finally(() => setLoading(false));
    }, [carregarTudo])
  );

  const aoPuxarParaAtualizar = async () => {
    setAtualizando(true);
    await carregarTudo();
    setAtualizando(false);
  };

  const metaCumprida = cardsHoje >= metaDiaria;
  const faltam = Math.max(metaDiaria - cardsHoje, 0);
  const progresso = Math.min(cardsHoje / metaDiaria, 1);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={aoPuxarParaAtualizar} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {nomeUsuario}!</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>{xp} XP</Text>
            </View>
          </View>

          <View style={styles.streakContainer}>
            <MaterialCommunityIcons
              name="fire"
              size={32}
              color={streak > 0 ? '#FF6B00' : '#ADB5BD'}
            />
            <View>
              <Text style={styles.streakText}>{streak}</Text>
              <Text style={styles.streakSubtext}>{streak === 1 ? 'Dia' : 'Dias'}</Text>
            </View>
          </View>
        </View>

        {/* Meta diária: mostra o que falta para manter/aumentar a ofensiva */}
        <View style={[local.meta, metaCumprida && local.metaOk]}>
          <View style={local.metaTopo}>
            <MaterialCommunityIcons
              name={metaCumprida ? 'check-decagram' : 'target'}
              size={22}
              color={metaCumprida ? '#2F9E44' : '#E8590C'}
            />
            <Text style={[local.metaTitulo, metaCumprida && { color: '#2F9E44' }]}>
              {metaCumprida ? 'Meta de hoje cumprida!' : 'Meta de hoje'}
            </Text>
            <Text style={local.metaContagem}>
              {Math.min(cardsHoje, metaDiaria)}/{metaDiaria}
            </Text>
          </View>

          <View style={local.barra}>
            <View
              style={[
                local.barraCheia,
                { width: `${progresso * 100}%` },
                metaCumprida && { backgroundColor: '#2F9E44' },
              ]}
            />
          </View>

          <Text style={local.metaTexto}>
            {metaCumprida
              ? streak > 0
                ? `Sua ofensiva de ${streak} ${streak === 1 ? 'dia está' : 'dias está'} garantida. Volte amanhã!`
                : 'Ótimo trabalho! Volte amanhã para continuar.'
              : streak > 0
                ? `Revise mais ${faltam} ${faltam === 1 ? 'card' : 'cards'} hoje para manter sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}.`
                : `Revise ${faltam} ${faltam === 1 ? 'card' : 'cards'} hoje para começar sua ofensiva.`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Suas matérias</Text>
        <Text style={styles.sectionSubtitle}>
          Estas são as salas em que você está matriculado.
        </Text>

        {salas.length === 0 ? (
          <View style={local.vazio}>
            <MaterialCommunityIcons name="school-outline" size={40} color="#ADB5BD" />
            <Text style={local.vazioTitulo}>Nenhuma sala por aqui</Text>
            <Text style={local.vazioTexto}>
              Peça o código ao seu professor e entre em uma sala abaixo.
            </Text>
          </View>
        ) : (
          salas.map((sala, index) => (
            <TouchableOpacity
              key={sala.id}
              activeOpacity={0.85}
              style={local.card}
              onPress={() => console.log(`Abrir sala: ${sala.nome}`)}
            >
              <View style={[local.icone, { backgroundColor: CORES[index % CORES.length] }]}>
                <MaterialCommunityIcons name="school" size={26} color="#FFFFFF" />
              </View>

              <View style={local.textos}>
                <Text style={local.nome} numberOfLines={1}>{sala.nome}</Text>
                <Text style={local.detalhe} numberOfLines={1}>
                  {sala.disciplina} • {sala.ano}
                </Text>
                {!!sala.professorNome && (
                  <Text style={local.detalhe} numberOfLines={1}>
                    Prof. {sala.professorNome}
                  </Text>
                )}
              </View>

              <MaterialCommunityIcons name="chevron-right" size={24} color="#ADB5BD" />
            </TouchableOpacity>
          ))
        )}

        {/* Ao ingressar, a lista de salas é recarregada */}
        <SecaoIngressarSala onIngressou={carregarSalas} />
      </ScrollView>
    </View>
  );
}

const local = StyleSheet.create({
  meta: {
    backgroundColor: '#FFF4E6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD8A8',
    padding: 14,
    marginBottom: 18,
  },
  metaOk: { backgroundColor: '#EBFBEE', borderColor: '#B2F2BB' },
  metaTopo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaTitulo: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#E8590C' },
  metaContagem: { fontSize: 14, fontWeight: 'bold', color: '#495057' },
  barra: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginTop: 10,
  },
  barraCheia: { height: 8, borderRadius: 4, backgroundColor: '#FF922B' },
  metaTexto: { fontSize: 13, color: '#495057', marginTop: 8, lineHeight: 18 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 14,
    marginBottom: 12,
  },
  icone: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textos: { flex: 1, marginHorizontal: 12 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  detalhe: { fontSize: 13, color: '#868E96', marginTop: 2 },
  vazio: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    marginBottom: 12,
  },
  vazioTitulo: { fontSize: 16, fontWeight: 'bold', color: '#495057', marginTop: 10 },
  vazioTexto: { fontSize: 13, color: '#868E96', textAlign: 'center', marginTop: 4 },
});