import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Stepper } from "../../components/Stepper/Stepper";
import { salaService } from "../../services/sala";
import { SalaDTO } from "../../services/sala/types";
import { flashcardService } from "../../services/flashcard";
import { FlashcardDTO, FlashcardPayload } from "../../services/flashcard/types";
import { styles } from "./styles";

// "12/02/2026" -> "2026-02-12"
// Retorna undefined se vazio (card disponível na hora) e null se a data for inválida
function dataBrParaISO(texto: string): string | null | undefined {
  const t = texto.trim();
  if (!t) return undefined;

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
  if (!m) return null;

  const [, dd, mm, aaaa] = m;
  const data = new Date(Number(aaaa), Number(mm) - 1, Number(dd));

  if (
    data.getFullYear() !== Number(aaaa) ||
    data.getMonth() !== Number(mm) - 1 ||
    data.getDate() !== Number(dd)
  ) {
    return null;
  }

  return `${aaaa}-${mm}-${dd}`;
}

// "2026-02-12" -> "12/02/2026"
function isoParaBr(iso: string): string {
  const [aaaa, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${aaaa}`;
}

// O backend manda { mensagem } (erros de regra) ou uma lista [{ campo, mensagem }] (validação)
function extrairMensagemErro(error: any, padrao: string): string {
  const data = error.response?.data;
  if (Array.isArray(data) && data.length > 0) {
    return data[0].mensagem || padrao;
  }
  return data?.mensagem || padrao;
}

export function BancoDeCards() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Etapa 1: dados do card
  const [frente, setFrente] = useState("");
  const [verso, setVerso] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [dataDisponibilidade, setDataDisponibilidade] = useState("");

  // Etapa 2: salas reais do backend
  const [salas, setSalas] = useState<SalaDTO[]>([]);
  const [carregandoSalas, setCarregandoSalas] = useState(false);
  const [salasSelecionadas, setSalasSelecionadas] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);

  // Etapa 3: resultado
  const [cardSalvo, setCardSalvo] = useState<FlashcardDTO | null>(null);
  const [nomesSalasEnviadas, setNomesSalasEnviadas] = useState<string[]>([]);
  const [foiAtualizacao, setFoiAtualizacao] = useState(false);

  const toggleSala = (id: number) => {
    if (salasSelecionadas.includes(id)) {
      setSalasSelecionadas(salasSelecionadas.filter((item) => item !== id));
    } else {
      setSalasSelecionadas([...salasSelecionadas, id]);
    }
  };

  // Recarrega a cada vez que entra na etapa 2, para pegar salas criadas há pouco
  const carregarSalas = async () => {
    try {
      setCarregandoSalas(true);
      const data = (await salaService.listarSalas()) as unknown as SalaDTO[];
      setSalas(data);
      setSalasSelecionadas((prev) =>
        prev.filter((id) => data.some((sala) => sala.id === id)),
      );
    } catch (error: any) {
      Alert.alert(
        "Erro ao carregar salas",
        extrairMensagemErro(error, "Não foi possível carregar as salas."),
      );
    } finally {
      setCarregandoSalas(false);
    }
  };

  // Etapa 1 -> 2: valida os campos e busca as salas
  const handleAvancar = () => {
    if (!frente.trim() || !verso.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha a frente e o verso do card.",
      );
      return;
    }

    if (dataBrParaISO(dataDisponibilidade) === null) {
      Alert.alert("Data inválida", "Use o formato dd/mm/aaaa, ex: 12/02/2026.");
      return;
    }

    setStep(2);
    carregarSalas();
  };

  // Etapa 2 -> 3: cria o card (ou atualiza, se já foi criado e o professor voltou para editar)
  const handleAtribuir = async () => {
    if (salasSelecionadas.length === 0) {
      Alert.alert(
        "Selecione uma sala",
        "Escolha ao menos uma sala de destino.",
      );
      return;
    }

    const payload: FlashcardPayload = {
      pergunta: frente.trim(),
      resposta: verso.trim(),
      imagem: imagemUrl.trim() || undefined,
      dataDisponibilidade: dataBrParaISO(dataDisponibilidade) ?? undefined,
      salaIds: salasSelecionadas,
    };

    const atualizando = cardSalvo !== null;

    try {
      setEnviando(true);

      const card = atualizando
        ? await flashcardService.atualizarFlashcard(cardSalvo.id, payload)
        : await flashcardService.criarFlashcard(payload);

      setCardSalvo(card);
      setFoiAtualizacao(atualizando);
      setNomesSalasEnviadas(
        salas
          .filter((sala) => salasSelecionadas.includes(sala.id))
          .map((sala) => sala.nome),
      );
      setStep(3);
    } catch (error: any) {
      Alert.alert(
        atualizando ? "Erro ao atualizar card" : "Erro ao criar card",
        extrairMensagemErro(error, "Não foi possível salvar o flashcard."),
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleCriarOutro = () => {
    setFrente("");
    setVerso("");
    setImagemUrl("");
    setDataDisponibilidade("");
    setSalasSelecionadas([]);
    setCardSalvo(null);
    setFoiAtualizacao(false);
    setStep(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Banco de Cards</Text>
        <Text style={styles.headerSubtitle}>
          Crie e distribua flashcards para sua turma
        </Text>

        <View style={styles.cardContainer}>
          <Stepper currentStep={step} />

          {/* ==================== ETAPA 1 ==================== */}
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>
                {cardSalvo ? "Editar flashcard" : "Criar novo flashcard"}
              </Text>
              <Text style={styles.stepSubtitle}>
                Preencha as informações do card e, na próxima etapa, escolha as
                salas de destino.
              </Text>

              <Text style={styles.label}>Frente (Pergunta/Conceito)</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a pergunta ou conceito..."
                value={frente}
                onChangeText={setFrente}
              />

              <Text style={styles.label}>Verso (Resposta/Explicação)</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Digite a resposta ou explicação..."
                multiline
                value={verso}
                onChangeText={setVerso}
              />

              <Text style={styles.label}>Imagem (Opcional)</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.flexInput}
                  placeholder="URL da imagem..."
                  autoCapitalize="none"
                  value={imagemUrl}
                  onChangeText={setImagemUrl}
                />
                <Feather name="image" size={20} color="#6C757D" />
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>
                Data de disponibilidade (Opcional)
              </Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.flexInput}
                  placeholder="dd/mm/aaaa"
                  keyboardType="numbers-and-punctuation"
                  value={dataDisponibilidade}
                  onChangeText={setDataDisponibilidade}
                />
                <Feather name="calendar" size={20} color="#6C757D" />
              </View>
              <Text style={styles.helperText}>
                Os alunos terão acesso a partir desse dia. Deixe vazio para
                liberar agora.
              </Text>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleAvancar}
              >
                <Text style={{ color: "#FFF", fontSize: 16, marginRight: 6 }}>
                  ⊕
                </Text>
                <Text style={styles.buttonPrimaryText}>
                  {cardSalvo ? "Continuar" : "Criar flashcard"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ==================== ETAPA 2 ==================== */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Salas de destino</Text>
              <Text style={styles.stepSubtitle}>
                Selecione para quais salas enviar este card.
              </Text>

              {carregandoSalas ? (
                <View style={{ paddingVertical: 24, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#155DFC" />
                </View>
              ) : salas.length === 0 ? (
                <Text
                  style={{ color: "#868E96", fontSize: 14, marginBottom: 12 }}
                >
                  Você ainda não tem salas. Crie uma na tela Salas e volte aqui.
                </Text>
              ) : (
                salas.map((sala) => {
                  const isSelected = salasSelecionadas.includes(sala.id);
                  return (
                    <TouchableOpacity
                      key={sala.id}
                      style={styles.checkboxRow}
                      onPress={() => toggleSala(sala.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Text style={{ color: "#FFF", fontSize: 12 }}>✓</Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.salaTitle}>{sala.nome}</Text>
                        <Text style={styles.salaSubtitle}>
                          {sala.disciplina} • {sala.quantidadeAlunos} Alunos
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}

              <TouchableOpacity
                style={[
                  styles.buttonPrimary,
                  { marginTop: 24 },
                  (enviando || carregandoSalas) && { opacity: 0.6 },
                ]}
                onPress={handleAtribuir}
                disabled={enviando || carregandoSalas}
              >
                {enviando ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text
                      style={{ color: "#FFF", fontSize: 16, marginRight: 6 }}
                    >
                      ✈️
                    </Text>
                    <Text style={styles.buttonPrimaryText}>
                      Atribuir a sala
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setStep(1)}
                disabled={enviando}
              >
                <Text style={styles.buttonSecondaryText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ==================== ETAPA 3 ==================== */}
          {step === 3 && cardSalvo && (
            <View>
              <Text style={styles.stepTitle}>
                {foiAtualizacao
                  ? "Card atualizado com sucesso!"
                  : "Card criado com sucesso!"}
              </Text>
              <Text style={styles.stepSubtitle}>
                Seu card foi enviado para: {nomesSalasEnviadas.join(", ")}
              </Text>

              <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>Frente:</Text>
                <Text style={styles.previewText}>{cardSalvo.pergunta}</Text>

                <Text style={styles.previewLabel}>Verso:</Text>
                <Text style={styles.previewText}>{cardSalvo.resposta}</Text>

                <Text style={styles.previewLabel}>Disponível a partir de:</Text>
                <Text style={styles.previewText}>
                  {cardSalvo.dataDisponibilidade
                    ? isoParaBr(cardSalvo.dataDisponibilidade)
                    : "Agora"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setStep(1)}
              >
                <Text style={styles.buttonSecondaryText}>Editar card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleCriarOutro}
              >
                <Text style={styles.buttonPrimaryText}>Criar outro card</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
