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

  // O Modal manda o ano como texto (anoLetivo); aqui convertemos pro formato do backend
  const handleCriarSala = async (novosDados: {
    nome: string;
    disciplina: string;
    anoLetivo: string;
  }) => {
    const anoNumero = parseInt(novosDados.anoLetivo, 10);

    if (isNaN(anoNumero)) {
      Alert.alert("Ano inválido", "Digite um ano válido, ex: 2026.");
      return;
    }

    try {
      const salaCriada = await salaService.criarSala({
        nome: novosDados.nome,
        disciplina: novosDados.disciplina,
        ano: anoNumero,
      });

      // Atualiza a lista localmente adicionando a resposta oficial da API no topo
      setSalas((prevSalas) => [salaCriada, ...prevSalas]);
      setModalVisible(false);
      Alert.alert(
        "Sucesso",
        `Sala criada! Código de convite: ${salaCriada.codigConvite}`,
      );
    } catch (error: any) {
      Alert.alert(
        "Erro ao criar sala",
        error.response?.data?.mensagem || "Falha ao conectar com o servidor.",
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardSala
              id={item.id.toString()}
              periodo={item.nome}
              materia={item.disciplina}
              ano={item.ano.toString()}
              numAlunos={item.quantidadeAlunos}
              codigoConvite={item.codigConvite}
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
        onSalaCriada={(novaSala) => {
          setSalas((prevSalas) => [novaSala, ...prevSalas]);
          setModalVisible(false);
        }}
      />
    </View>
  );
}
