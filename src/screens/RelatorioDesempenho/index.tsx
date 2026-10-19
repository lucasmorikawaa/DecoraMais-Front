
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { salaService } from '../../services/sala';
import {
  relatorioService,
  RelatorioTurma,
} from '../../services/relatorio';

type Sala = {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
};

// Fator de facilidade (SM-2): de 1,3 (difícil) a 2,5 (fácil)
function facilidadeParaPercentual(fator: number): number {
  const pct = ((fator - 1.3) / (2.5 - 1.3)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function extrairErro(e: any): string {
  if (!e?.response) {
    return 'Não foi possível conectar ao servidor.';
  }

  return (
    e.response.data?.mensagem ||
    'Não foi possível carregar o relatório.'
  );
}

export function RelatorioDesempenho() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [salaSelecionada, setSalaSelecionada] =
    useState<Sala | null>(null);
  const [relatorio, setRelatorio] =
    useState<RelatorioTurma | null>(null);
  const [listaAberta, setListaAberta] = useState(false);
  const [busca, setBusca] = useState('');
  const [loadingSalas, setLoadingSalas] = useState(true);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);

  // Carrega as salas do professor logado
  useEffect(() => {
    (async () => {
      try {
        const lista = await salaService.listarMinhasSalas();

        setSalas(lista);

        if (lista.length > 0) {
          setSalaSelecionada(lista[0]);
        }
      } catch (e) {
        Alert.alert('Erro', extrairErro(e));
      } finally {
        setLoadingSalas(false);
      }
    })();
  }, []);

  // Busca o relatório da sala selecionada
  const carregarRelatorio = useCallback(async (sala: Sala) => {
    setLoadingRelatorio(true);

    try {
      setRelatorio(
        await relatorioService.obterRelatorioTurma(sala.id)
      );
    } catch (e) {
      setRelatorio(null);
      Alert.alert('Erro', extrairErro(e));
    } finally {
      setLoadingRelatorio(false);
    }
  }, []);

  useEffect(() => {
    if (salaSelecionada) {
      carregarRelatorio(salaSelecionada);
    }
  }, [salaSelecionada, carregarRelatorio]);

  const semDados =
    !relatorio ||
    (relatorio.mediaFatorFacilidade === 0 &&
      relatorio.cardsMaisDificeis.length === 0);

  const percentual = semDados
    ? null
    : facilidadeParaPercentual(
        relatorio!.mediaFatorFacilidade
      );

  // Filtra e limita a exibição aos três cards mais difíceis
  const cardsFiltrados = useMemo(() => {
    const todos = relatorio?.cardsMaisDificeis ?? [];
    const termo = busca.trim().toLowerCase();

    const filtrados = termo
      ? todos.filter((c) =>
          c.pergunta.toLowerCase().includes(termo)
        )
      : todos;

    return filtrados.slice(0, 3);
  }, [relatorio, busca]);

  const rotuloSala = (s: Sala) =>
    `${s.ano} - ${s.disciplina} | ${s.nome}`;

  if (loadingSalas) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>
        Relatório de Desempenho
      </Text>

      <Text style={styles.subtitulo}>
        Acompanhe o progresso da turma
      </Text>

      {salas.length === 0 ? (
        <View style={styles.vazio}>
          <Feather
            name="bar-chart-2"
            size={40}
            color="#ADB5BD"
          />

          <Text style={styles.vazioTitulo}>
            Nenhuma sala criada
          </Text>

          <Text style={styles.vazioTexto}>
            Crie uma sala em "Salas" para ver o desempenho da turma.
          </Text>
        </View>
      ) : (
        <>
          {/* Seletor de sala */}
          <TouchableOpacity
            style={styles.select}
            activeOpacity={0.8}
            onPress={() => setListaAberta((v) => !v)}
          >
            <Text
              style={styles.selectTexto}
              numberOfLines={1}
            >
              {salaSelecionada
                ? rotuloSala(salaSelecionada)
                : 'Selecione uma sala'}
            </Text>

            <Feather
              name={
                listaAberta ? 'chevron-up' : 'chevron-down'
              }
              size={20}
              color="#495057"
            />
          </TouchableOpacity>

          {listaAberta && (
            <View style={styles.lista}>
              {salas.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.listaItem,
                    salaSelecionada?.id === s.id &&
                      styles.listaItemAtivo,
                  ]}
                  onPress={() => {
                    setSalaSelecionada(s);
                    setListaAberta(false);
                    setBusca('');
                  }}
                >
                  <Text
                    style={styles.listaTexto}
                    numberOfLines={1}
                  >
                    {rotuloSala(s)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Busca de cards */}
          <View style={styles.busca}>
            <Feather
              name="search"
              size={18}
              color="#868E96"
            />

            <TextInput
              style={styles.buscaInput}
              placeholder="Buscar card..."
              placeholderTextColor="#868E96"
              value={busca}
              onChangeText={setBusca}
              autoCorrect={false}
            />
          </View>

          {loadingRelatorio ? (
            <ActivityIndicator
              size="large"
              color="#155DFC"
              style={{ marginTop: 32 }}
            />
          ) : (
            <>
              {/* Resumo da turma */}
              <View style={styles.cardResumo}>
                <View style={styles.resumoEsq}>
                  <Text
                    style={styles.resumoTitulo}
                    numberOfLines={1}
                  >
                    {salaSelecionada
                      ? `${salaSelecionada.ano} - ${salaSelecionada.nome}`
                      : ''}
                  </Text>

                  <Text
                    style={styles.resumoSub}
                    numberOfLines={1}
                  >
                    {salaSelecionada?.disciplina}
                  </Text>

                  <Text style={styles.resumoAlunos}>
                    {relatorio?.totalAlunos ?? 0} aluno(s)
                  </Text>
                </View>

                <View style={styles.resumoDir}>
                  <Text style={styles.resumoPct}>
                    {percentual === null
                      ? '--'
                      : `${percentual}%`}
                  </Text>

                  <Text style={styles.resumoSub}>
                    Média da turma
                  </Text>
                </View>
              </View>

              {/* Cards mais difíceis */}
              <View style={styles.cardDificeis}>
                <Text style={styles.dificeisTitulo}>
                  Cards Mais Difíceis da Turma
                </Text>

                <Text style={styles.dificeisSub}>
                  Os 3 cards com menor facilidade entre os alunos
                  desta sala — considere revisar em aula.
                </Text>

                {cardsFiltrados.length === 0 ? (
                  <Text style={styles.semCards}>
                    {busca
                      ? 'Nenhum card encontrado para essa busca.'
                      : 'Ainda não há revisões dos alunos nesta sala.'}
                  </Text>
                ) : (
                  cardsFiltrados.map((card, index) => (
                    <View
                      key={card.cardId}
                      style={styles.cardDificil}
                    >
                      <View style={styles.posicao}>
                        <Text style={styles.posicaoTexto}>
                          {index + 1}
                        </Text>
                      </View>

                      <Text
                        style={styles.pergunta}
                        numberOfLines={3}
                      >
                        {card.pergunta}
                      </Text>

                      <View style={styles.cardRodape}>
                        <Text style={styles.rodapeLabel}>
                          Facilidade:
                        </Text>

                        <Text style={styles.rodapeValor}>
                          {card.notaMedia.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

export default RelatorioDesempenho;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  centro: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  subtitulo: {
    fontSize: 15,
    color: '#868E96',
    marginTop: 4,
    marginBottom: 16,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  selectTexto: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    marginRight: 8,
  },
  lista: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginTop: 6,
    overflow: 'hidden',
  },
  listaItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listaItemAtivo: {
    backgroundColor: '#EDF2FF',
  },
  listaTexto: {
    fontSize: 14,
    color: '#212529',
  },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 12,
  },
  buscaInput: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
  },
  cardResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    marginTop: 20,
  },
  resumoEsq: {
    flex: 1,
    marginRight: 12,
  },
  resumoDir: {
    alignItems: 'flex-end',
  },
  resumoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  resumoSub: {
    fontSize: 13,
    color: '#868E96',
    marginTop: 2,
  },
  resumoAlunos: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 4,
  },
  resumoPct: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#155DFC',
  },
  cardDificeis: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    marginTop: 16,
  },
  dificeisTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  dificeisSub: {
    fontSize: 13,
    color: '#868E96',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  semCards: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
    paddingVertical: 20,
  },
  cardDificil: {
    backgroundColor: '#FFE3E3',
    borderWidth: 1.5,
    borderColor: '#FF8787',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 22,
    paddingBottom: 12,
    marginBottom: 14,
  },
  posicao: {
    position: 'absolute',
    top: -10,
    left: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C92A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posicaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pergunta: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 12,
  },
  cardRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rodapeLabel: {
    fontSize: 13,
    color: '#868E96',
  },
  rodapeValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C92A2A',
  },
  vazio: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 28,
    marginTop: 8,
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 10,
  },
  vazioTexto: {
    fontSize: 13,
    color: '#868E96',
    textAlign: 'center',
    marginTop: 4,
  },
});
