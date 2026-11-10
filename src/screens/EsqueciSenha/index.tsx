import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recuperacaoService } from '../../services/recuperacaoSenha';
import { MedidorSenha } from '../../components/MedidorSenha';
import { avaliarSenha, EXIGIR_SENHA_FORTE } from '../../utils/senhaForte';

type Props = {
  onVoltar: () => void; // volta para o login
  onConcluir: () => void; // senha trocada: vai para o login
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ESPERA_REENVIO = 60; // segundos

function extrairMensagemErro(error: any): string {
  if (!error?.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e o IP do back-end.';
  }
  const { data } = error.response;
  if (Array.isArray(data) && data.length > 0) return data[0].mensagem || 'Dados inválidos.';
  if (data?.mensagem) return data.mensagem;
  return 'Não foi possível concluir a operação.';
}

// joao@email.com -> j***@email.com
function mascararEmail(email: string): string {
  const [usuario, dominio] = email.split('@');
  if (!usuario || !dominio) return email;
  return `${usuario[0]}***@${dominio}`;
}

export function EsqueciSenha({ onVoltar, onConcluir }: Props) {
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [segundos, setSegundos] = useState(0);

  // Contagem regressiva para liberar "Reenviar código"
  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const limparErro = () => { if (erro) setErro(''); };

  const enviarCodigo = async (reenvio = false) => {
    const emailLimpo = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(emailLimpo)) {
      setErro('Informe um e-mail válido.');
      return;
    }

    setErro('');
    setLoading(true);
    try {
      await recuperacaoService.solicitarCodigo(emailLimpo);
      setEmail(emailLimpo);
      setEtapa('codigo');
      setSegundos(ESPERA_REENVIO);
      if (reenvio) {
        Alert.alert('Código reenviado', 'Confira sua caixa de entrada (e o spam).');
      }
    } catch (error: any) {
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
    }
  };

  const senhaForte = avaliarSenha(novaSenha).forte;
  const senhasIguais = novaSenha.length > 0 && novaSenha === confirmarSenha;
  const podeRedefinir = codigo.length === 6 && senhaForte && senhasIguais && !loading;

  const redefinir = async () => {
    if (codigo.length !== 6) {
      setErro('Digite o código de 6 dígitos.');
      return;
    }
    if (!senhaForte) {
      setErro(
        'Senha fraca: use no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.'
      );
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setErro('');
    setLoading(true);
    try {
      await recuperacaoService.redefinirSenha(email, codigo, novaSenha);
      Alert.alert(
        'Senha redefinida!',
        'Agora você já pode entrar com a nova senha.',
        [{ text: 'Ir para o login', onPress: onConcluir }],
        { cancelable: false }
      );
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
        <TouchableOpacity
          style={styles.voltar}
          onPress={etapa === 'codigo' ? () => { setEtapa('email'); setErro(''); } : onVoltar}
          hitSlop={10}
          disabled={loading}
        >
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>

        <Text style={styles.logo}>Decora+</Text>

        {etapa === 'email' ? (
          <>
            <View style={styles.iconeCirculo}>
              <Feather name="mail" size={28} color="#155DFC" />
            </View>
            <Text style={styles.titulo}>Esqueceu a senha?</Text>
            <Text style={styles.subtitulo}>
              Informe o e-mail da sua conta e enviaremos um código de 6 dígitos para você criar uma nova senha.
            </Text>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#ADB5BD"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(t) => { setEmail(t); limparErro(); }}
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={() => enviarCodigo(false)}
              />
            </View>

            <TouchableOpacity
              style={[styles.botao, loading && styles.botaoDesabilitado]}
              onPress={() => enviarCodigo(false)}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.botaoTexto}>Enviar código</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBox} onPress={onVoltar} disabled={loading}>
              <Text style={styles.link}>Voltar para o login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.iconeCirculo}>
              <Feather name="shield" size={28} color="#155DFC" />
            </View>
            <Text style={styles.titulo}>Digite o código</Text>
            <Text style={styles.subtitulo}>
              Enviamos um código de 6 dígitos para{' '}
              <Text style={{ fontWeight: '700', color: '#212529' }}>{mascararEmail(email)}</Text>.
              Ele vale por 10 minutos.
            </Text>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Text style={styles.label}>Código</Text>
            <TextInput
              style={styles.codigoInput}
              placeholder="000000"
              placeholderTextColor="#CED4DA"
              keyboardType="number-pad"
              maxLength={6}
              value={codigo}
              onChangeText={(t) => { setCodigo(t.replace(/\D/g, '').slice(0, 6)); limparErro(); }}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => enviarCodigo(true)}
              disabled={segundos > 0 || loading}
            >
              <Text style={[styles.link, (segundos > 0 || loading) && { color: '#ADB5BD' }]}>
                {segundos > 0 ? `Reenviar código em ${segundos}s` : 'Reenviar código'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Nova senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={EXIGIR_SENHA_FORTE ? 'Mínimo de 8 caracteres' : 'Mínimo de 6 caracteres'}
                placeholderTextColor="#ADB5BD"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={novaSenha}
                onChangeText={(t) => { setNovaSenha(t); limparErro(); }}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6C757D" />
              </TouchableOpacity>
            </View>

            {EXIGIR_SENHA_FORTE && <MedidorSenha senha={novaSenha} />}

            <Text style={styles.label}>Confirmar nova senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repita a nova senha"
                placeholderTextColor="#ADB5BD"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmarSenha}
                onChangeText={(t) => { setConfirmarSenha(t); limparErro(); }}
                editable={!loading}
                returnKeyType="go"
                onSubmitEditing={redefinir}
              />
            </View>

            <TouchableOpacity
              style={[styles.botao, !podeRedefinir && styles.botaoDesabilitado]}
              onPress={redefinir}
              disabled={!podeRedefinir}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.botaoTexto}>Redefinir senha</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EsqueciSenha;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },
  voltar: { marginTop: 40, width: 40, height: 40, justifyContent: 'center' },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#155DFC', marginTop: 8, marginBottom: 20 },
  iconeCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  subtitulo: { fontSize: 14, color: '#868E96', marginTop: 8, marginBottom: 20, lineHeight: 20 },
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
  codigoInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    height: 60,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 10,
    color: '#155DFC',
  },
  botao: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  botaoDesabilitado: { backgroundColor: '#A5C0FB' },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkBox: { alignItems: 'center', paddingVertical: 14 },
  link: { color: '#155DFC', fontSize: 14, fontWeight: '600' },
});