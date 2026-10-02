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

// O backend retorna erros como { status, mensagem } (em português).
// Essa função pega a mensagem certa, com um texto padrão caso não exista.
function extrairMensagemErro(error: any, padrao: string): string {
  return error.response?.data?.mensagem || padrao;
}

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
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // 1. Busca os dados do usuário do Back-end Spring Boot
  const carregarPerfil = async () => {
    try {
      setLoading(true);

      const response = await api.get("/usuarios/me");
      const perfil = {
        nome: response.data.nome || "",
        email: response.data.email || "",
        // OBS: "instituicao" não existe no back-end (UsuarioResponseDTO só tem
        // id/nome/email/tipo). Por isso sempre volta vazio e cai no "Fatec" aqui.
        // Esse campo hoje é só visual, não é salvo de verdade no servidor.
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
        extrairMensagemErro(error, "Não foi possível carregar as informações do usuário.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // 2. Envia os dados atualizados para a API (nome/e-mail)
  const handleSalvarPerfil = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome e e-mail.");
      return;
    }

    try {
      setSalvando(true);

      await api.put("/usuarios/me", {
        nome,
        email,
        // instituicao é enviada mas o back-end ignora esse campo (não existe lá ainda)
        instituicao,
      });

      // Atualiza o backup com as novas informações salvas
      setDadosOriginais({ nome, email, instituicao });
      Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
      setEditandoPerfil(false);
    } catch (error: any) {
      Alert.alert(
        "Erro ao salvar",
        extrairMensagemErro(error, "Falha ao atualizar o perfil no servidor.")
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

  // 3. Troca a senha do usuário (exige a senha atual)
  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Campos obrigatórios", "Preencha a senha atual, a nova senha e a confirmação.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Senha muito curta", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Senhas não conferem", "A nova senha e a confirmação precisam ser iguais.");
      return;
    }

    try {
      setAlterandoSenha(true);

      await api.put("/usuarios/senha", {
        senhaAtual,
        novaSenha,
      });

      Alert.alert("Sucesso", "Sua senha foi alterada.");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      // Ex: "Senha atual incorreta." vem direto do backend
      Alert.alert(
        "Erro ao alterar senha",
        extrairMensagemErro(error, "Não foi possível alterar a senha.")
      );
    } finally {
      setAlterandoSenha(false);
    }
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
            autoCapitalize="none"
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

          <TouchableOpacity
            style={[styles.buttonSecondary, alterandoSenha && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={handleAlterarSenha}
            disabled={alterandoSenha}
          >
            {alterandoSenha ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.buttonSecondaryText}>Alterar senha</Text>
            )}
          </TouchableOpacity>
        </SettingsCard>
      </ScrollView>
    </View>
  );
}
