import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/auth';
import { styles } from './styles';
import { LoginScreenProps } from './types';

export function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  navigation, // Caso esteja utilizando o React Navigation
}: LoginScreenProps & { navigation?: any }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    // 1. Validação local básica de campos vazios
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      // 2. Chamada HTTP real para a API Spring Boot
      const response = await authService.login({
        email: email.trim(),
        senha: senha.trim(),
      });

      // 3. Salva o Token JWT e os Dados do Usuário no dispositivo
      await AsyncStorage.setItem('@DecoraPlus:token', response.token);
      await AsyncStorage.setItem('@DecoraPlus:user', JSON.stringify(response.usuario));

      // 4. Avisa o componente pai (App.js) quem logou.
      // É o App.js quem decide para qual tela ir com base em usuario.tipo.
      onLoginSuccess?.(response.usuario);

    } catch (error: any) {
      // 5. Captura erros reais retornados pelo Spring Boot (Status 401, 403 ou indisponibilidade)
      if (error.response) {
        if (error.response.status === 401) {
          setErro('E-mail ou senha inválidos.');
        } else {
          setErro(error.response.data?.message || 'Erro ao realizar login.');
        }
      } else if (error.request) {
        setErro('Não foi possível conectar ao servidor. Verifique seu IP/Backend.');
      } else {
        setErro('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.logoText}>Decora+</Text>
          <Text style={styles.subtitleText}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

          <Text style={styles.label}>E-mail *</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="seu.email@fatec.sp.gov.br"
              placeholderTextColor="#ADB5BD"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#6C757D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#ADB5BD"
              secureTextEntry={!showPassword}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6C757D" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={onNavigateToForgotPassword || (() => Alert.alert('Recuperação', 'Link de redefinição enviado.'))}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={onNavigateToRegister || (() => Alert.alert('Cadastro', 'Criar nova conta.'))}>
            <Text style={styles.signUpText}> Criar conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}