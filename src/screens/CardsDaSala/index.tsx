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
  Modal,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { authService } from '../../services/auth';
import { MedidorSenha } from '../../components/MedidorSenha';
import { avaliarSenha, EXIGIR_SENHA_FORTE } from '../../utils/senhaForte';

type TipoConta = 'ALUNO' | 'PROFESSOR';

type Props = {
  tipo: TipoConta;
  onVoltar: () => void;
  onCadastroSuccess: (usuario: any) => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Texto do termo de aceite (ajuste conforme as regras do seu projeto/instituição)
const TERMOS: { titulo: string; texto: string }[] = [
  {
    titulo: '1. Sobre o Decora+',
    texto:
      'O Decora+ é uma plataforma de estudos baseada em flashcards e repetição espaçada. Professores criam salas e cards; alunos estudam e acompanham sua evolução.',
  },
  {
    titulo: '2. Cadastro e conta',
    texto:
      'Para usar o aplicativo é preciso criar uma conta com informações verdadeiras. Você é responsável por manter sua senha em sigilo e por toda atividade realizada na sua conta. Avise-nos caso suspeite de uso indevido.',
  },
  {
    titulo: '3. Uso adequado',
    texto:
      'É proibido usar o Decora+ para publicar conteúdo ofensivo, ilegal ou que viole direitos de terceiros, tentar acessar contas ou dados de outras pessoas, ou prejudicar o funcionamento do sistema.',
  },
  {
    titulo: '4. Dados pessoais (LGPD)',
    texto:
      'Coletamos nome, e-mail, tipo de conta e dados de estudo (como cards revisados e desempenho) apenas para o funcionamento do aplicativo, como gerar relatórios para professores e controlar sua pontuação. Seus dados não são vendidos nem compartilhados com terceiros para fins comerciais. Você pode solicitar a correção ou a exclusão dos seus dados a qualquer momento.',
  },
  {
    titulo: '5. Conteúdo e imagens',
    texto:
      'Os professores são responsáveis pelos cards e imagens que enviam, garantindo que têm o direito de usá-los. Conteúdo que viole estes termos poderá ser removido.',
  },
  {
    titulo: '6. XP e insígnias',
    texto:
      'O XP e as insígnias são recursos de gamificação, não possuem valor monetário, não podem ser trocados por dinheiro e podem ser ajustados para manter o equilíbrio da plataforma.',
  },
  {
    titulo: '7. Alterações',
    texto:
      'Estes termos podem ser atualizados. Quando houver mudanças relevantes, você será avisado no aplicativo.',
  },
];

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

  // Termo de aceite
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  const ehProfessor = tipo === 'PROFESSOR';
  const senhaForte = avaliarSenha(senha).forte;

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
    if (!senhaForte) {
      setErro(
        'Senha fraca: use no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.'
      );
      return;
    }
    // Regra mínima que continua valendo mesmo com a senha forte desligada
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }
    if (!aceitouTermos) {
      setErro('Você precisa aceitar os Termos de Uso para criar a conta.');
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

  // O botão só libera com senha forte E termos aceitos
  const botaoBloqueado = loading || !senhaForte || !aceitouTermos;

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
            placeholder={EXIGIR_SENHA_FORTE ? 'Mínimo de 8 caracteres' : 'Mínimo de 6 caracteres'}
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

        {/* Barra de força e lista de requisitos (aparece ao digitar) */}
        {EXIGIR_SENHA_FORTE && <MedidorSenha senha={senha} />}

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

        {/* Termo de aceite (obrigatório) */}
        <View style={styles.termosLinha}>
          <TouchableOpacity
            style={[styles.checkbox, aceitouTermos && styles.checkboxMarcado]}
            onPress={() => { setAceitouTermos((v) => !v); limparErro(); }}
            disabled={loading}
            hitSlop={8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceitouTermos }}
            accessibilityLabel="Aceitar os Termos de Uso"
          >
            {aceitouTermos && <Feather name="check" size={16} color="#FFFFFF" />}
          </TouchableOpacity>

          <Text style={styles.termosTexto}>
            Li e aceito os{' '}
            <Text style={styles.termosLink} onPress={() => setMostrarTermos(true)}>
              Termos de Uso e a Política de Privacidade
            </Text>
            . *
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.botao, botaoBloqueado && styles.botaoDesabilitado]}
          onPress={handleCadastrar}
          disabled={botaoBloqueado}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoTexto}>Criar conta</Text>
          )}
        </TouchableOpacity>

        {!aceitouTermos && (
          <Text style={styles.dicaTermos}>
            Aceite os Termos de Uso para liberar o cadastro.
          </Text>
        )}
      </ScrollView>

      {/* Modal com o texto completo dos termos */}
      <Modal
        visible={mostrarTermos}
        animationType="slide"
        onRequestClose={() => setMostrarTermos(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalTopo}>
            <Text style={styles.modalTitulo}>Termos de Uso</Text>
            <TouchableOpacity onPress={() => setMostrarTermos(false)} hitSlop={10}>
              <Feather name="x" size={26} color="#495057" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalCorpo} showsVerticalScrollIndicator>
            <Text style={styles.modalIntro}>
              Ao criar uma conta no Decora+, você concorda com as regras abaixo.
            </Text>

            {TERMOS.map((secao) => (
              <View key={secao.titulo} style={{ marginBottom: 16 }}>
                <Text style={styles.secaoTitulo}>{secao.titulo}</Text>
                <Text style={styles.secaoTexto}>{secao.texto}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalRodape}>
            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.8}
              onPress={() => {
                setAceitouTermos(true);
                limparErro();
                setMostrarTermos(false);
              }}
            >
              <Text style={styles.botaoTexto}>Li e aceito</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoFechar} onPress={() => setMostrarTermos(false)}>
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Termo de aceite
  termosLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 22,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ADB5BD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxMarcado: { backgroundColor: '#155DFC', borderColor: '#155DFC' },
  termosTexto: { flex: 1, fontSize: 14, color: '#495057', lineHeight: 20 },
  termosLink: { color: '#155DFC', fontWeight: '600', textDecorationLine: 'underline' },
  dicaTermos: { fontSize: 12, color: '#868E96', textAlign: 'center', marginTop: 10 },

  botao: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  botaoDesabilitado: { backgroundColor: '#A5C0FB' },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  // Modal dos termos
  modal: { flex: 1, backgroundColor: '#FFFFFF' },
  modalTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  modalCorpo: { padding: 20 },
  modalIntro: { fontSize: 14, color: '#868E96', marginBottom: 18, lineHeight: 20 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#212529', marginBottom: 4 },
  secaoTexto: { fontSize: 14, color: '#495057', lineHeight: 21 },
  modalRodape: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  botaoFechar: { alignItems: 'center', paddingVertical: 14 },
  botaoFecharTexto: { color: '#868E96', fontSize: 15, fontWeight: '600' },
});