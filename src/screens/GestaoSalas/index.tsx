import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { BotaoCriarSala } from "../../components/Button/BotaoCriarSala/BotaoCriarSala";
import { CardSala } from "../../components/CardSala/CardSala";
import { ModalCriarSala } from "../../components/Modal/ModalCriarSala/ModalCriarSala";
import { salaService } from "../../services/sala";
import { SalaDTO } from "../../services/sala/types";
import { styles } from "./styles";

export function GestaoSalas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [salaEmEdicao, setSalaEmEdicao] = useState<SalaDTO | null>(null);
  const [salas, setSalas] = useState<SalaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca as salas no Spring Boot ao montar o componente
  const carregarSalas = async () => {
    try {
      setLoading(true);
      const data = await salaService.listarSalas();
      setSalas(data);
    } catch (error: any) {
      Alert.alert(
        "Erro ao carregar",
        error.response?.data?.mensagem || "Não foi possível carregar as salas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  // Pede confirmação e exclui a sala no backend
  const handleExcluirSala = (sala: SalaDTO) => {
    Alert.alert(
      "Excluir sala",
      `Tem certeza que deseja excluir "${sala.nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await salaService.excluirSala(sala.id);
              setSalas((prev) => prev.filter((s) => s.id !== sala.id));
            } catch (error: any) {
              const status = error.response?.status;

              if (status === 403) {
                // Sala de outro professor
                Alert.alert(
                  "Sem permissão",
                  error.response?.data?.mensagem ||
                    "Você não tem permissão para excluir esta sala.",
                );
              } else if (status === 500) {
                Alert.alert(
                  "Não foi possível excluir",
                  "Essa sala provavelmente tem flashcards vinculados. Remova os flashcards dela antes de excluir.",
                );
              } else {
                Alert.alert(
                  "Erro ao excluir",
                  error.response?.data?.mensagem ||
                    "Não foi possível excluir a sala.",
                );
              }
            }
          },
        },
      ],
    );
  };

  // Menu aberto ao tocar nos três pontos do card
  const abrirOpcoesSala = (sala: SalaDTO) => {
    Alert.alert(sala.nome, "O que você deseja fazer?", [
      {
        text: "Editar",
        onPress: () => {
          setSalaEmEdicao(sala);
          setModalVisible(true);
        },
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => handleExcluirSala(sala),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Gestão de Salas</Text>
        <Text style={styles.subtitle}>Gerencie suas turmas e disciplinas</Text>
      </View>

      <BotaoCriarSala
        onPress={() => {
          setSalaEmEdicao(null);
          setModalVisible(true);
        }}
      />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardSala
              id={String(item.id)}
              periodo={item.nome}
              materia={item.disciplina}
              ano={String(item.ano)}
              numAlunos={item.quantidadeAlunos}
              codigoConvite={item.codigConvite}
              onPressMenu={() => abrirOpcoesSala(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#868E96", fontSize: 14 }}>
                Nenhuma sala cadastrada ainda.
              </Text>
              <Text style={{ color: "#ADB5BD", fontSize: 12, marginTop: 4 }}>
                Clique em "+ Criar Sala" para adicionar.
              </Text>
            </View>
          )}
        />
      )}

      <ModalCriarSala
        visible={modalVisible}
        salaParaEditar={salaEmEdicao}
        onClose={() => {
          setModalVisible(false);
          setSalaEmEdicao(null);
        }}
        onSalaCriada={(novaSala) => {
          setSalas((prev) => [novaSala, ...prev]);
        }}
        onSalaAtualizada={(salaAtualizada) => {
          setSalas((prev) =>
            prev.map((s) => (s.id === salaAtualizada.id ? salaAtualizada : s)),
          );
        }}
      />
    </View>
  );
}