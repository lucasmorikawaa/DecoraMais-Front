import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Stepper } from "../../components/Stepper/Stepper";
import { styles } from "./styles";
import { Feather, Ionicons } from "@expo/vector-icons";

export function BancoDeCards() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  
  const [frente, setFrente] = useState("");
  const [verso, setVerso] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [dataDisponibilidade, setDataDisponibilidade] = useState("12/02/2026");

  
  const [salasSelecionadas, setSalasSelecionadas] = useState<string[]>(["2"]);
  const toggleSala = (id: string) => {
    if (salasSelecionadas.includes(id)) {
      setSalasSelecionadas(salasSelecionadas.filter((item) => item !== id));
    } else {
      setSalasSelecionadas([...salasSelecionadas, id]);
    }
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

          
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>Criar novo flashcard</Text>
              <Text style={styles.stepSubtitle}>
                Preencha as informações do card e selecione as salas de destino
                ao lado direito.
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
                  value={imagemUrl}
                  onChangeText={setImagemUrl}
                />
                <Feather name="image" size={20} color="#6C757D" />
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>
                Data de disponibilidade
              </Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.flexInput}
                  value={dataDisponibilidade}
                  onChangeText={setDataDisponibilidade}
                />
                <Feather name="calendar" size={20} color="#6C757D" />
              </View>
              <Text style={styles.helperText}>
                Os alunos terão acesso à partir desse dia.
              </Text>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => setStep(2)}
              >
                <Text style={{ color: "#FFF", fontSize: 16, marginRight: 6 }}>
                  ⊕
                </Text>
                <Text style={styles.buttonPrimaryText}>Criar flashcard</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ==================== ETAPA 2 ==================== */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Salas de destino</Text>
              <Text style={styles.stepSubtitle}>
                Selecione a sala para quais salas enviar este card.
              </Text>

              {[
                {
                  id: "1",
                  nome: "2° Semestre - ADS",
                  sub: "Gestão de projetos • 20 Alunos",
                },
                {
                  id: "2",
                  nome: "6° Semestre - GTI",
                  sub: "Inglês V • 32 Alunos",
                },
                {
                  id: "3",
                  nome: "1° Semestre - ADS",
                  sub: "Engenharia de Software I • 18 Alunos",
                },
                { id: "4", nome: "9° Ano B", sub: "Biologia • 40 Alunos" },
              ].map((sala) => {
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
                      <Text style={styles.salaSubtitle}>{sala.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.buttonPrimary, { marginTop: 24 }]}
                onPress={() => setStep(3)}
              >
                <Text style={{ color: "#FFF", fontSize: 16, marginRight: 6 }}>
                  ✈️
                </Text>
                <Text style={styles.buttonPrimaryText}>Atribuir a sala</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ==================== ETAPA 3 ==================== */}
          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>Card criado com sucesso!!</Text>
              <Text style={styles.stepSubtitle}>
                Seu card foi criado e enviado para a turma 2° Semestre - GTI
              </Text>

              <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>Frente:</Text>
                <Text style={styles.previewText}>
                  {frente || "O que é Scrum?"}
                </Text>

                <Text style={styles.previewLabel}>Verso:</Text>
                <Text style={styles.previewText}>
                  {verso ||
                    "O Scrum é um framework ágil de gerenciamento de projetos focado na entrega rápida, contínua e colaborativa de valor ao cliente."}
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
                onPress={() => {
                  setFrente("");
                  setVerso("");
                  setStep(1);
                }}
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
