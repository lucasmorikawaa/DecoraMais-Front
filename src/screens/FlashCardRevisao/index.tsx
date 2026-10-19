import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { flashcardService } from '../../services/flashcard';
import { FlashcardDTO } from '../../services/flashcard/types';

type Props = {
  sala: { id: number; nome: string };
  onFechar: () => void;
};

const OPCOES = [
  { nota: 0, label: 'Não lembro', cor: '#FA5252', icone: 'refresh-cw' as const },
  { nota: 3, label: 'Difícil', cor: '#F5B800', icone: 'alert-triangle' as const },
  { nota: 4, label: 'Regular', cor: '#4C8DF6', icone: 'clock' as const },
  { nota: 5, label: 'Fácil', cor: '#63C35C', icone: 'check' as const },
];

export function SessaoFlashcards({ sala, onFechar }: Props) {
  const [cards, setCards] = useState<FlashcardDTO[]>([]);
  const [indice, setIndice] = useState(0);
  const [virado, setVirado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const todos = await flashcardService.listarPendentesRevisao();
        // Só os cards desta sala
        setCards(todos.filter((c) => c.salaIds?.includes(sala.id)));
      } catch (e: any) {
        Alert.alert(
          'Erro',
          e?.response?.data?.mensagem || 'Não foi possível carregar os flashcards.'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [sala.id]);

  const total = cards.length;
  const concluido = total > 0 && indice >= total;
  const card = cards[indice];

  const avaliar = async (nota: number) => {
    if (!card || enviando) return;
    setEnviando(true);
    try {
      await flashcardService.avaliarFlashcard(card.id, nota);
      setVirado(false);
      setIndice((i) => i + 1);
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e?.response?.data?.mensagem || 'Não foi possível registrar sua resposta.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const Topo = (
    <View style={styles.topo}>
      <TouchableOpacity onPress={onFechar} hitSlop={10} style={styles.fechar}>
        <Feather name="x" size={26} color="#495057" />
      </TouchableOpacity>
      <Text style={styles.contador}>
        {total > 0 ? `${Math.min(indice + 1, total)}/${total}` : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  // Nada para revisar
  if (total === 0) {
    return (
      <View style={styles.container}>
        {Topo}
        <View style={styles.centroConteudo}>
          <Feather name="check-circle" size={56} color="#63C35C" />
          <Text style={styles.fimTitulo}>Tudo em dia!</Text>
          <Text style={styles.fimTexto}>
            Não há flashcards para revisar agora em "{sala.nome}". Volte mais tarde.
          </Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={onFechar}>
            <Text style={styles.botaoPrimarioTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Sessão concluída
  if (concluido) {
    return (
      <View style={styles.container}>
        {Topo}
        <View style={styles.centroConteudo}>
          <Feather name="award" size={56} color="#155DFC" />
          <Text style={styles.fimTitulo}>Sessão concluída!</Text>
          <Text style={styles.fimTexto}>
            Você revisou {total} {total === 1 ? 'card' : 'cards'} de "{sala.nome}".
          </Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={onFechar}>
            <Text style={styles.botaoPrimarioTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progresso = (indice / total) * 100;
  const temImagem = !!card.imagem && card.imagem.startsWith('http');

  return (
    <View style={styles.container}>
      {Topo}

      <View style={styles.barra}>
        <View style={[styles.barraPreenchida, { width: `${progresso}%` }]} />
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => setVirado((v) => !v)}
      >
        <Text style={[styles.cardRotulo, virado && styles.cardRotuloResposta]}>
          {virado ? 'Resposta' : 'Pergunta'}
        </Text>

        <View style={styles.cardCorpo}>
          {temImagem && (
            <Image source={{ uri: card.imagem! }} style={styles.imagem} resizeMode="contain" />
          )}
          {virado ? (
            <Text style={styles.resposta}>{card.resposta}</Text>
          ) : (
            <>
              <Text style={styles.pergunta}>{card.pergunta}</Text>
              <Text style={styles.dica}>Toque para ver a resposta</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {virado && (
        <View style={styles.opcoes}>
          {OPCOES.map((op) => (
            <TouchableOpacity
              key={op.nota}
              activeOpacity={0.85}
              disabled={enviando}
              style={[styles.opcao, { backgroundColor: op.cor }, enviando && styles.opcaoDesabilitada]}
              onPress={() => avaliar(op.nota)}
            >
              <Feather name={op.icone} size={24} color="#FFFFFF" />
              <Text style={styles.opcaoTexto}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default SessaoFlashcards;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 48 },
  centro: { justifyContent: 'center', alignItems: 'center' },
  centroConteudo: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },

  topo: { height: 40, justifyContent: 'center', alignItems: 'center' },
  fechar: { position: 'absolute', left: 0 },
  contador: { fontSize: 16, fontWeight: 'bold', color: '#212529' },

  barra: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DEE2E6',
    marginTop: 14,
    marginBottom: 24,
    overflow: 'hidden',
  },
  barraPreenchida: { height: 8, borderRadius: 4, backgroundColor: '#155DFC' },

  card: {
    height: 300,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CED4DA',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  cardRotulo: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#868E96' },
  cardRotuloResposta: { color: '#15AABF' },
  cardCorpo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagem: { width: '100%', height: 100, marginBottom: 12 },
  pergunta: { fontSize: 17, fontWeight: 'bold', color: '#212529', textAlign: 'center' },
  dica: { fontSize: 13, color: '#868E96', marginTop: 8 },
  resposta: { fontSize: 15, color: '#212529', textAlign: 'center', lineHeight: 22 },

  opcoes: { marginTop: 20, gap: 10 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 18,
  },
  opcaoDesabilitada: { opacity: 0.6 },
  opcaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  fimTitulo: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginTop: 16 },
  fimTexto: { fontSize: 15, color: '#868E96', textAlign: 'center', marginTop: 8 },
  botaoPrimario: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  botaoPrimarioTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});