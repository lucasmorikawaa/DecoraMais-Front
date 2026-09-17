import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BotaoCriarSala } from "../../components/Button/BotaoCriarSala/BotaoCriarSala";
import { CardSala } from "../../components/CardSala/CardSala";
import { ModalCriarSala } from "../../components/Modal/ModalCriarSala/ModalCriarSala";
import { salaService } from "../../services/sala";
import { SalaDTO } from "../../services/sala/types";
import { styles } from "./styles";

export function GestaoSalas() {
  const [modalVisible, setModalVisible] = useState(false);
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
        error.response?.data?.message || "Não foi possível carregar as salas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  // Envia os dados para a API e adiciona na lista após resposta 201 Created
  const handleCriarSala = async (novosDados: {
    nome: string;
    disciplina: string;
    anoLetivo: string;
  }) => {
    try {
      const salaCriada = await salaService.criarSala({
        nome: novosDados.nome,
        disciplina: novosDados.disciplina,
        anoLetivo: novosDados.anoLetivo,
      });

      // Atualiza a lista localmente adicionando a resposta oficial da API no topo
      setSalas((prevSalas) => [salaCriada, ...prevSalas]);
      setModalVisible(false);
      Alert.alert("Sucesso", "Sala criada com sucesso!");
    } catch (error: any) {
      Alert.alert(
        "Erro ao criar sala",
        error.response?.data?.message || "Falha ao conectar com o servidor.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Gestão de Salas</Text>
        <Text style={styles.subtitle}>Gerencie suas turmas e disciplinas</Text>
      </View>

      <BotaoCriarSala onPress={() => setModalVisible(true)} />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardSala
              id={item.id}
              periodo={item.nome}
              materia={item.disciplina}
              ano={item.anoLetivo}
              numAlunos={item.numAlunos}
              codigoConvite={item.codigoConvite}
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
        onClose={() => setModalVisible(false)}
        onSubmit={handleCriarSala}
      />
    </View>
  );
}