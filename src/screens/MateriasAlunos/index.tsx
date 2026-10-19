import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { salaService } from '../../services/sala';
import { styles } from './styles';
import { TodasMateriasScreenProps } from './types';
import { SessaoFlashcards } from '../FlashCardRevisao';

type SalaAluno = {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
  professorNome?: string | null;
};

const CORES = ['#FF922B', '#15AABF', '#CC5DE8', '#51CF66', '#FF6B6B', '#339AF0'];

export function TodasMateriasScreen({ onSelectMateria }: TodasMateriasScreenProps) {
  const [salas, setSalas] = useState<SalaAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [salaEstudo, setSalaEstudo] = useState<SalaAluno | null>(null);

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      await carregarSalas();
      setLoading(false);
    })();
  }, [carregarSalas]);

  const aoPuxarParaAtualizar = async () => {
    setAtualizando(true);
    await carregarSalas();
    setAtualizando(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  // Sessão de flashcards da sala escolhida
  if (salaEstudo) {
    return <SessaoFlashcards sala={salaEstudo} onFechar={() => setSalaEstudo(null)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas matérias</Text>

      <FlatList
        data={salas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={local.card}
            onPress={() => {
              setSalaEstudo(item);
              onSelectMateria?.(String(item.id));
            }}
          >
            <View style={[local.icone, { backgroundColor: CORES[index % CORES.length] }]}>
              <MaterialCommunityIcons name="school" size={26} color="#FFFFFF" />
            </View>

            <View style={local.textos}>
              <Text style={local.nome} numberOfLines={1}>{item.nome}</Text>
              <Text style={local.detalhe} numberOfLines={1}>
                {item.disciplina} • {item.ano}
              </Text>
              {!!item.professorNome && (
                <Text style={local.detalhe} numberOfLines={1}>
                  Prof. {item.professorNome}
                </Text>
              )}
            </View>

            <MaterialCommunityIcons name="chevron-right" size={24} color="#ADB5BD" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={local.vazio}>
            <MaterialCommunityIcons name="school-outline" size={40} color="#ADB5BD" />
            <Text style={local.vazioTitulo}>Nenhuma sala por aqui</Text>
            <Text style={local.vazioTexto}>
              Você ainda não entrou em nenhuma sala. Use o código do professor na tela inicial.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={aoPuxarParaAtualizar} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const local = StyleSheet.create({
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
  },
  vazioTitulo: { fontSize: 16, fontWeight: 'bold', color: '#495057', marginTop: 10 },
  vazioTexto: { fontSize: 13, color: '#868E96', textAlign: 'center', marginTop: 4 },
});