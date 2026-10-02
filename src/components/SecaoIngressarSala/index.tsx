import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./style";

import { salaService } from "../../services/sala";
import { SalaDTO } from "../../services/sala/types";

export function SecaoIngressarSala() {
  const [codigoSala, setCodigoSala] = useState("");

  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingEntrada, setLoadingEntrada] = useState(false);

  const [salaPreview, setSalaPreview] = useState<SalaDTO | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  // =========================================================
  // 1. BUSCAR SALA PELO CÓDIGO
  // =========================================================
  const handleBuscarSala = async () => {
    const codigoLimpo = codigoSala.trim().toUpperCase();

    if (!codigoLimpo) {
      Alert.alert(
        "Atenção",
        "Digite o código da sala para buscar."
      );
      return;
    }

    try {
      setLoadingBusca(true);

      // Busca a sala no backend
      const sala = await salaService.buscarSalaPorCodigo(codigoLimpo);

      // Salva os dados da sala
      setSalaPreview(sala);

      // Abre o modal com os dados encontrados
      setModalVisible(true);

    } catch (error: any) {
      console.log("Erro ao buscar sala:", error);

      if (error.response?.status === 404) {
        Alert.alert(
          "Sala não encontrada",
          "Não existe nenhuma sala com esse código."
        );
      } else if (error.response?.status === 401) {
        Alert.alert(
          "Sessão expirada",
          "Faça login novamente para continuar."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível buscar a sala."
        );
      }
    } finally {
      setLoadingBusca(false);
    }
  };

  // =========================================================
  // 2. CONFIRMAR ENTRADA NA SALA
  // =========================================================
  const handleConfirmarEntrada = async () => {
    if (!salaPreview) {
      return;
    }

    try {
      setLoadingEntrada(true);

      // Envia o código da sala para o backend
      await salaService.ingressarNaSala(
        salaPreview.codigConvite
      );

      Alert.alert(
        "Sucesso!",
        `Você entrou na sala "${salaPreview.nome}".`
      );

      // Fecha o modal
      setModalVisible(false);

      // Limpa o campo
      setCodigoSala("");

      // Limpa a sala selecionada
      setSalaPreview(null);

    } catch (error: any) {
      console.log("Erro ao ingressar na sala:", error);

      if (error.response?.status === 404) {
        Alert.alert(
          "Sala não encontrada",
          "Essa sala não existe ou o código é inválido."
        );
      } else if (error.response?.status === 409) {
        Alert.alert(
          "Atenção",
          "Você já está nesta sala."
        );
      } else if (error.response?.status === 401) {
        Alert.alert(
          "Sessão expirada",
          "Faça login novamente para continuar."
        );
      } else {
        Alert.alert(
          "Erro ao entrar",
          error.response?.data?.message ||
            "Não foi possível ingressar na sala."
        );
      }
    } finally {
      setLoadingEntrada(false);
    }
  };

  // =========================================================
  // 3. FECHAR MODAL
  // =========================================================
  const handleFecharModal = () => {
    if (loadingEntrada) {
      return;
    }

    setModalVisible(false);
    setSalaPreview(null);
  };

  // =========================================================
  // 4. RENDER
  // =========================================================
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Ingressar em uma sala
      </Text>

      <Text style={styles.sectionSubtitle}>
        Entre em uma sala usando o código fornecido pelo seu professor.
      </Text>

      {/* Campo para digitar o código */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Código da sala (ex: ABC123)"
          placeholderTextColor="#ADB5BD"
          value={codigoSala}
          onChangeText={setCodigoSala}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!loadingBusca}
        />

        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleBuscarSala}
          disabled={loadingBusca}
        >
          {loadingBusca ? (
            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />
          ) : (
            <Text style={styles.enterButtonText}>
              ENTRAR
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* =====================================================
          MODAL DE CONFIRMAÇÃO
          ===================================================== */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleFecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            {/* Cabeçalho */}
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons
                name="school"
                size={28}
                color="#155DFC"
              />

              <Text style={styles.modalTitle}>
                Confirmar Sala
              </Text>
            </View>

            {/* Informações da sala */}
            {salaPreview && (
              <View style={styles.salaDetails}>

                {/* Nome da sala */}
                <Text style={styles.salaNome}>
                  {salaPreview.nome}
                </Text>

                {/* Disciplina */}
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>
                    Disciplina:{" "}
                  </Text>

                  {salaPreview.disciplina}
                </Text>

                {/* Ano */}
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>
                    Ano:{" "}
                  </Text>

                  {salaPreview.ano}
                </Text>

                {/* Código da sala */}
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>
                    Código:{" "}
                  </Text>

                  {salaPreview.codigConvite}
                </Text>

              </View>
            )}

            {/* Botões */}
            <View style={styles.modalActions}>

              {/* Cancelar */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleFecharModal}
                disabled={loadingEntrada}
              >
                <Text style={styles.cancelButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              {/* Confirmar */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmarEntrada}
                disabled={loadingEntrada}
              >
                {loadingEntrada ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                  />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Confirmar
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}