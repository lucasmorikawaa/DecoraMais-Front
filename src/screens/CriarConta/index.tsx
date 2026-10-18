import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { authService } from '../../services/auth';

type TipoConta = 'ALUNO' | 'PROFESSOR';

type Props = {
  tipo: TipoConta;
  onVoltar: () => void;
  onCadastroSuccess: (usuario: any) => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function extrairMensagemErro(error: any): string {
  if (!error?.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e o IP do back-end.';
  }
  const { status, data } = error.response;

  if (status === 409) return 'Este e-mail já está cadastrado.';
  if (Array.isArray(data) && data.length > 0) return data[0].mensagem || 'Dados inválidos.';
  if (data?.mensagem) return data.mensagem;
  return 'Não foi possível criar a conta.';
}

export function CriarConta({ tipo, onVoltar, onCadastroSuccess }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const ehProfessor = tipo === 'PROFESSOR';

  const limparErro = () => { if (erro) setErro(''); };

  const handleCadastrar = async () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!EMAIL_REGEX.test(emailLimpo)) {
      setErro('Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      // 1. Cria a conta
      await api.post('/auth/register', {
        nome: nomeLimpo,
        email: emailLimpo,
        senha,
        tipo,
      });

      // 2. Login automático com as credenciais recém-criadas
      const response = await authService.login({ email: emailLimpo, senha });
      await AsyncStorage.setItem('@DecoraPlus:token', response.token);
      await AsyncStorage.setItem('@DecoraPlus:user', JSON.stringify(response.usuario));

      onCadastroSuccess(response.usuario);
    } catch (error: any) {
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F9FF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.voltar} onPress={onVoltar} hitSlop={10} disabled={loading}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>

        <Text style={styles.logo}>Decora+</Text>
        <Text style={styles.titulo}>Criar conta</Text>

        <View style={styles.badge}>
          <MaterialCommunityIcons
            name={ehProfessor ? 'human-male-board' : 'school-outline'}
            size={18}
            color="#155DFC"
          />
          <Text style={styles.badgeTexto}>{ehProfessor ? 'Professor' : 'Aluno'}</Text>
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Text style={styles.label}>Nome completo *</Text>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#ADB5BD"
            value={nome}
            onChangeText={(t) => { setNome(t); limparErro(); }}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>E-mail *</Text>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="seu.email@fatec.sp.gov.br"
            placeholderTextColor="#ADB5BD"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(t) => { setEmail(t); limparErro(); }}
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>Senha *</Text>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor="#ADB5BD"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={senha}
            onChangeText={(t) => { setSenha(t); limparErro(); }}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar senha *</Text>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Repita a senha"
            placeholderTextColor="#ADB5BD"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmarSenha}
            onChangeText={(t) => { setConfirmarSenha(t); limparErro(); }}
            editable={!loading}
            returnKeyType="go"
            onSubmitEditing={handleCadastrar}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDesabilitado]}
          onPress={handleCadastrar}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoTexto}>Criar conta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default CriarConta;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },
  voltar: { marginTop: 40, width: 40, height: 40, justifyContent: 'center' },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#155DFC', marginTop: 8, marginBottom: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  badgeTexto: { color: '#155DFC', fontWeight: '600', fontSize: 13 },
  erro: {
    color: '#E03131',
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 13,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#212529', marginBottom: 6, marginTop: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: '#212529', fontSize: 15 },
  eyeIcon: { padding: 4 },
  botao: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  botaoDesabilitado: { backgroundColor: '#A5C0FB' },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});