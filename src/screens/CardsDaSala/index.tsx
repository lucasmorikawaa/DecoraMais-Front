import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { flashcardService, urlImagem } from '../../services/flashcard';
import { FlashcardDTO } from '../../services/flashcard/types';
import { SeletorImagem } from '../../components/SeletorImagem';

type Props = {
  sala: { id: number; nome: string };
  onFechar: () => void;
};

// Se a tela de gestão esconder o header do drawer, aumente para 48
const PADDING_TOPO = 16;

function resumo(texto: string, max = 40) {
  return texto.length > max ? `${texto.slice(0, max)}…` : texto;
}

function dataBr(iso?: string | null) {
  if (!iso) return null;
  const [a, m, d] = iso.split('-');
  return a && m && d ? `${d}/${m}/${a}` : iso;
}

function disponivelNoFuturo(iso?: string | null) {
  if (!iso) return false;
  return iso > new Date().toISOString().slice(0, 10);
}

export function CardsDaSala({ sala, onFechar }: Props) {
  const [cards, setCards] = useState<FlashcardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState('');

  // Edição
  const [editando, setEditando] = useState<FlashcardDTO | null>(null);
  const [editPergunta, setEditPergunta] = useState('');
  const [editResposta, setEditResposta] = useState('');
  const [editImagem, setEditImagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Exclusão em massa
  const [progresso, setProgresso] = useState<{ feito: number; total: number } | null>(null);

  const carregar = useCallback(async () => {
    try {
      const lista = await flashcardService.listarPorSala(sala.id);
      setCards(lista);
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e?.response?.data?.mensagem || 'Não foi possível carregar os cards desta sala.'
      );
    } finally {
      setLoading(false);
      setAtualizando(false);
    }
  }, [sala.id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return cards;
    return cards.filter(
      (c) =>
        c.pergunta.toLowerCase().includes(termo) || c.resposta.toLowerCase().includes(termo)
    );
  }, [cards, busca]);

  // ---------- Editar ----------
  const abrirEdicao = (card: FlashcardDTO) => {
    setEditando(card);
    setEditPergunta(card.pergunta);
    setEditResposta(card.resposta);
    setEditImagem(card.imagem ?? null);
  };

  const alterado =
    !!editando &&
    (editPergunta.trim() !== editando.pergunta ||
      editResposta.trim() !== editando.resposta ||
      (editImagem ?? null) !== (editando.imagem ?? null));

  const valido = editPergunta.trim().length > 0 && editResposta.trim().length > 0;

  const fecharEdicao = () => {
    if (salvando) return;
    if (alterado) {
      Alert.alert('Descartar alterações?', 'Você editou este card e ainda não salvou.', [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => setEditando(null) },
      ]);
    } else {
      setEditando(null);
    }
  };

  const salvarEdicao = async () => {
    if (!editando || !alterado || !valido || salvando) return;
    setSalvando(true);
    try {
      const atualizado = await flashcardService.atualizarFlashcard(editando.id, {
        pergunta: editPergunta.trim(),
        resposta: editResposta.trim(),
        imagem: editImagem ?? undefined,
        dataDisponibilidade: editando.dataDisponibilidade ?? undefined,
        salaIds: editando.salaIds,
      });
      setCards((prev) => prev.map((c) => (c.id === atualizado.id ? atualizado : c)));
      setEditando(null);
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e?.response?.data?.mensagem || 'Não foi possível salvar as alterações.'
      );
    } finally {
      setSalvando(false);
    }
  };

  // ---------- Excluir um ----------
  const excluirUm = (card: FlashcardDTO) => {
    const emVarias = (card.salaIds?.length ?? 0) > 1;
    Alert.alert(
      'Excluir este card?',
      `"${resumo(card.pergunta)}"\n\n` +
        (emVarias
          ? 'Ele também está em outras salas e será removido de todas. '
          : '') +
        'Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await flashcardService.excluirFlashcard(card.id);
              setCards((prev) => prev.filter((c) => c.id !== card.id));
            } catch (e: any) {
              Alert.alert(
                'Erro',
                e?.response?.data?.mensagem || 'Não foi possível excluir o card.'
              );
            }
          },
        },
      ]
    );
  };

  // ---------- Excluir todos ----------
  const excluirTodos = () => {
    const total = cards.length;
    const emVarias = cards.filter((c) => (c.salaIds?.length ?? 0) > 1).length;

    Alert.alert(
      `Excluir todos os ${total} cards?`,
      `Todos os cards de "${sala.nome}" serão apagados.` +
        (emVarias > 0
          ? `\n\n${emVarias} ${emVarias === 1 ? 'deles também está' : 'deles também estão'} em outras salas e será removido de lá também.`
          : '') +
        '\n\nEssa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir todos',
          style: 'destructive',
          onPress: async () => {
            const alvo = [...cards];
            let falhas = 0;
            setProgresso({ feito: 0, total: alvo.length });

            for (let i = 0; i < alvo.length; i++) {
              try {
                await flashcardService.excluirFlashcard(alvo[i].id);
              } catch {
                falhas++;
              }
              setProgresso({ feito: i + 1, total: alvo.length });
            }

            setProgresso(null);
            await carregar();

            if (falhas > 0) {
              Alert.alert(
                'Concluído com avisos',
                `${falhas} ${falhas === 1 ? 'card não pôde' : 'cards não puderam'} ser excluído(s). Tente novamente.`
              );
            }
          },
        },
      ]
    );
  };

  // ---------- Renderização ----------
  const renderItem = ({ item }: { item: FlashcardDTO }) => {
    const uri = urlImagem(item.imagem);
    const emVarias = (item.salaIds?.length ?? 0) > 1;
    const futuro = disponivelNoFuturo(item.dataDisponibilidade);

    return (
      <TouchableOpacity activeOpacity={0.8} style={s.card} onPress={() => abrirEdicao(item)}>
        {uri ? (
          <Image source={{ uri }} style={s.miniatura} resizeMode="cover" />
        ) : (
          <View style={[s.miniatura, s.miniaturaVazia]}>
            <Feather name="file-text" size={22} color="#ADB5BD" />
          </View>
        )}

        <View style={s.cardTexto}>
          <Text style={s.pergunta} numberOfLines={2}>
            {item.pergunta}
          </Text>
          <Text style={s.resposta} numberOfLines={1}>
            {item.resposta}
          </Text>

          {(emVarias || futuro) && (
            <View style={s.metas}>
              {emVarias && (
                <View style={s.meta}>
                  <Feather name="layers" size={11} color="#495057" />
                  <Text style={s.metaTexto}>Em {item.salaIds.length} salas</Text>
                </View>
              )}
              {futuro && (
                <View style={[s.meta, s.metaAviso]}>
                  <Feather name="clock" size={11} color="#E67700" />
                  <Text style={[s.metaTexto, { color: '#E67700' }]}>
                    Libera em {dataBr(item.dataDisponibilidade)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={s.acoes}>
          <TouchableOpacity
            style={s.botaoIcone}
            hitSlop={6}
            onPress={() => abrirEdicao(item)}
            accessibilityLabel="Editar card"
          >
            <Feather name="edit-2" size={18} color="#155DFC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.botaoIcone}
            hitSlop={6}
            onPress={() => excluirUm(item)}
            accessibilityLabel="Excluir card"
          >
            <Feather name="trash-2" size={18} color="#E03131" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      {/* Topo */}
      <View style={s.topo}>
        <TouchableOpacity onPress={onFechar} hitSlop={10} accessibilityLabel="Voltar">
          <Feather name="arrow-left" size={26} color="#212529" />
        </TouchableOpacity>
        <View style={s.topoTextos}>
          <Text style={s.titulo}>Cards da sala</Text>
          <Text style={s.subtitulo} numberOfLines={1}>
            {sala.nome}
          </Text>
        </View>
        <View style={s.contador}>
          <Text style={s.contadorTexto}>{cards.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={s.centro}>
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      ) : (
        <>
          {cards.length > 4 && (
            <View style={s.busca}>
              <Feather name="search" size={18} color="#868E96" />
              <TextInput
                style={s.buscaInput}
                placeholder="Buscar por pergunta ou resposta"
                placeholderTextColor="#ADB5BD"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca('')} hitSlop={10}>
                  <Feather name="x-circle" size={18} color="#ADB5BD" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <FlatList
            data={filtrados}
            keyExtractor={(c) => String(c.id)}
            renderItem={renderItem}
            contentContainerStyle={s.lista}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={() => {
                  setAtualizando(true);
                  carregar();
                }}
                colors={['#155DFC']}
              />
            }
            ListEmptyComponent={
              cards.length === 0 ? (
                <View style={s.vazio}>
                  <Feather name="inbox" size={44} color="#ADB5BD" />
                  <Text style={s.vazioTitulo}>Nenhum card nesta sala</Text>
                  <Text style={s.vazioTexto}>
                    Crie cards no Banco de Cards e selecione esta sala para eles aparecerem aqui.
                  </Text>
                </View>
              ) : (
                <View style={s.vazio}>
                  <Feather name="search" size={44} color="#ADB5BD" />
                  <Text style={s.vazioTitulo}>Nada encontrado</Text>
                  <Text style={s.vazioTexto}>Nenhum card combina com "{busca}".</Text>
                </View>
              )
            }
          />

          {/* Ação destrutiva separada da lista, para não ser tocada sem querer */}
          {cards.length > 0 && (
            <View style={s.rodape}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={s.botaoExcluirTodos}
                onPress={excluirTodos}
              >
                <Feather name="trash-2" size={18} color="#E03131" />
                <Text style={s.botaoExcluirTodosTexto}>Excluir todos os cards</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Modal de edição */}
      <Modal
        visible={!!editando}
        animationType="slide"
        onRequestClose={fecharEdicao}
      >
        <KeyboardAvoidingView
          style={s.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={s.modalTopo}>
            <TouchableOpacity onPress={fecharEdicao} hitSlop={10}>
              <Text style={s.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={s.modalTitulo}>Editar card</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView
            contentContainerStyle={s.modalCorpo}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={s.rotulo}>Pergunta</Text>
            <TextInput
              style={[s.input, s.inputGrande]}
              value={editPergunta}
              onChangeText={setEditPergunta}
              multiline
              textAlignVertical="top"
              placeholder="Digite a pergunta"
              placeholderTextColor="#ADB5BD"
              editable={!salvando}
            />

            <Text style={s.rotulo}>Resposta</Text>
            <TextInput
              style={[s.input, s.inputGrande]}
              value={editResposta}
              onChangeText={setEditResposta}
              multiline
              textAlignVertical="top"
              placeholder="Digite a resposta"
              placeholderTextColor="#ADB5BD"
              editable={!salvando}
            />

            <Text style={s.rotulo}>Imagem (opcional)</Text>
            <SeletorImagem value={editImagem} onChange={setEditImagem} disabled={salvando} />
          </ScrollView>

          <View style={s.modalRodape}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!alterado || !valido || salvando}
              style={[s.botaoSalvar, (!alterado || !valido || salvando) && s.botaoSalvarOff]}
              onPress={salvarEdicao}
            >
              {salvando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.botaoSalvarTexto}>Salvar alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Progresso da exclusão em massa (bloqueia a tela) */}
      <Modal visible={!!progresso} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.overlayCaixa}>
            <ActivityIndicator size="large" color="#E03131" />
            <Text style={s.overlayTitulo}>Excluindo cards…</Text>
            <Text style={s.overlayTexto}>
              {progresso?.feito}/{progresso?.total}
            </Text>
            <View style={s.overlayBarra}>
              <View
                style={[
                  s.overlayBarraCheia,
                  {
                    width: `${progresso ? (progresso.feito / progresso.total) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CardsDaSala;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: PADDING_TOPO },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topoTextos: { flex: 1 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  subtitulo: { fontSize: 13, color: '#868E96', marginTop: 1 },
  contador: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E7F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  contadorTexto: { color: '#155DFC', fontWeight: 'bold', fontSize: 14 },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  buscaInput: { flex: 1, fontSize: 14, color: '#212529' },

  lista: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 10, flexGrow: 1 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 12,
  },
  miniatura: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F1F3F5' },
  miniaturaVazia: { justifyContent: 'center', alignItems: 'center' },
  cardTexto: { flex: 1 },
  pergunta: { fontSize: 15, fontWeight: '600', color: '#212529' },
  resposta: { fontSize: 13, color: '#868E96', marginTop: 2 },
  metas: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  metaAviso: { backgroundColor: '#FFF4E0' },
  metaTexto: { fontSize: 11, fontWeight: '600', color: '#495057' },

  acoes: { gap: 6 },
  botaoIcone: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  vazio: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 32, gap: 8 },
  vazioTitulo: { fontSize: 17, fontWeight: '700', color: '#343A40', marginTop: 6 },
  vazioTexto: { fontSize: 14, color: '#868E96', textAlign: 'center', lineHeight: 20 },

  rodape: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  botaoExcluirTodos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E03131',
  },
  botaoExcluirTodosTexto: { color: '#E03131', fontSize: 15, fontWeight: '600' },

  // Modal de edição
  modal: { flex: 1, backgroundColor: '#FFFFFF' },
  modalTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalCancelar: { fontSize: 15, color: '#868E96', width: 60 },
  modalTitulo: { fontSize: 17, fontWeight: 'bold', color: '#212529' },
  modalCorpo: { padding: 16, paddingBottom: 32 },
  rotulo: { fontSize: 13, fontWeight: '600', color: '#495057', marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
    backgroundColor: '#FFFFFF',
  },
  inputGrande: { minHeight: 90 },
  modalRodape: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  botaoSalvar: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoSalvarOff: { backgroundColor: '#ADB5BD' },
  botaoSalvarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  // Progresso da exclusão em massa
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  overlayCaixa: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  overlayTitulo: { fontSize: 16, fontWeight: '700', color: '#212529', marginTop: 8 },
  overlayTexto: { fontSize: 14, color: '#868E96' },
  overlayBarra: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E9ECEF',
    overflow: 'hidden',
    marginTop: 6,
  },
  overlayBarraCheia: { height: 8, borderRadius: 4, backgroundColor: '#E03131' },
});