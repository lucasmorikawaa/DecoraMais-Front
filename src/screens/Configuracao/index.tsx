import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { SettingsCard } from "../../components/ConfiguracaoCard/ConfiguracaoCard";
import { styles } from "./styles";

export function Configuracoes() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  // Guardam os dados originais vindos do Back-end (para restaurar ao cancelar)
  const [dadosOriginais, setDadosOriginais] = useState({
    nome: "",
    email: "",
    instituicao: "",
  });

  // Estados dos inputs
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [instituicao, setInstituicao] = useState("");

  // Estados para Segurança
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // 1. Busca os dados do usuário do Back-end Spring Boot
  const carregarPerfil = async () => {
    try {
      setLoading(true);

      const response = await api.get("/auth/me");
      const perfil = {
        nome: response.data.nome || "",
        email: response.data.email || "",
        instituicao: response.data.instituicao || "Fatec",
      };

      // Atualiza os estados de input e o estado de backup
      setNome(perfil.nome);
      setEmail(perfil.email);
      setInstituicao(perfil.instituicao);
      setDadosOriginais(perfil);
    } catch (error: any) {
      Alert.alert(
        "Erro ao carregar",
        error.response?.data?.message ||
          "Não foi possível carregar as informações do usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // 2. Envia os dados atualizados para a API (PUT/PATCH)
  const handleSalvarPerfil = async () => {
    try {
      setSalvando(true);

      await api.put("/usuarios/me", {
        nome,
        email,
        instituicao,
      });

      // Atualiza o backup com as novas informações salvas
      setDadosOriginais({ nome, email, instituicao });
      Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
      setEditandoPerfil(false);
    } catch (error: any) {
      Alert.alert(
        "Erro ao salvar",
        error.response?.data?.message ||
          "Falha ao atualizar o perfil no servidor."
      );
    } finally {
      setSalvando(false);
    }
  };

  // Restaura os valores originais e fecha o modo de edição
  const handleCancelarEdicao = () => {
    setNome(dadosOriginais.nome);
    setEmail(dadosOriginais.email);
    setInstituicao(dadosOriginais.instituicao);
    setEditandoPerfil(false);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>
          Gerencie suas preferências e conta
        </Text>

        {/* Card 1: Informações do Perfil */}
        <SettingsCard
          icon={<Ionicons name="person-outline" size={20} color="#155DFC" />}
          title="Informações do perfil"
          subtitle="Atualize suas informações pessoais do perfil"
        >
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={[styles.input, !editandoPerfil && { opacity: 0.6 }]}
            value={nome}
            onChangeText={setNome}
            editable={editandoPerfil}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, !editandoPerfil && { opacity: 0.6 }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={editandoPerfil}
          />

          <Text style={styles.label}>Instituição</Text>
          <TextInput
            style={[styles.input, !editandoPerfil && { opacity: 0.6 }]}
            value={instituicao}
            onChangeText={setInstituicao}
            editable={editandoPerfil}
          />

          {editandoPerfil ? (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              {/* Botão Cancelar */}
              <TouchableOpacity
                style={[
                  styles.buttonSecondary,
                  { flex: 1, marginTop: 0, justifyContent: "center" },
                ]}
                activeOpacity={0.8}
                onPress={handleCancelarEdicao}
                disabled={salvando}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>

              {/* Botão Salvar */}
              <TouchableOpacity
                style={[
                  styles.buttonPrimary,
                  { flex: 1, justifyContent: "center" },
                ]}
                activeOpacity={0.8}
                onPress={handleSalvarPerfil}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.buttonPrimaryText}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Botão Editar quando não estiver em modo de edição */
            <TouchableOpacity
              style={styles.buttonPrimary}
              activeOpacity={0.8}
              onPress={() => setEditandoPerfil(true)}
            >
              <Ionicons name="pencil-outline" size={16} color="#FFFFFF" />
              <Text style={styles.buttonPrimaryText}>Editar</Text>
            </TouchableOpacity>
          )}
        </SettingsCard>

        {/* Card 2: Segurança */}
        <SettingsCard
          icon={
            <Ionicons name="lock-closed-outline" size={20} color="#155DFC" />
          }
          title="Segurança"
          subtitle="Gerencie a segurança da sua conta"
        >
          <Text style={styles.label}>Senha atual</Text>
          <TextInput
            style={styles.input}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
          />

          <Text style={styles.label}>Nova senha</Text>
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar nova senha</Text>
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8}>
            <Text style={styles.buttonSecondaryText}>Alterar senha</Text>
          </TouchableOpacity>
        </SettingsCard>
      </ScrollView>
    </View>
  );
}