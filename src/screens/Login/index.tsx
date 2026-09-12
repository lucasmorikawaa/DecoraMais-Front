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
import { styles } from './styles';
import { LoginScreenProps } from './types';

export function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setErro('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (email.includes('@')) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErro('Insira um endereço de e-mail válido.');
      }
    }, 1500);
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