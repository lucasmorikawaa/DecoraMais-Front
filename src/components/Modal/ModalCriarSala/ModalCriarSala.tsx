import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { salaService } from '../../../services/sala';
import { SalaDTO } from '../../../services/sala/types';

interface ModalCriarSalaProps {
  visible: boolean;
  onClose: () => void;
  onSalaCriada: (novaSala: SalaDTO) => void;
}

export function ModalCriarSala({ visible, onClose, onSalaCriada }: ModalCriarSalaProps) {
  const [nome, setNome] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [ano, setAno] = useState('');
  const [criando, setCriando] = useState(false);

  const limparCampos = () => {
    setNome('');
    setDisciplina('');
    setAno('');
  };

  const handleCriar = async () => {
    if (!nome.trim() || !disciplina.trim() || !ano.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, disciplina e ano.');
      return;
    }

    const anoNumero = parseInt(ano, 10);
    if (isNaN(anoNumero)) {
      Alert.alert('Ano inválido', 'Digite um ano válido, ex: 2026.');
      return;
    }

    try {
      setCriando(true);

      const novaSala = await salaService.criarSala({
        nome: nome.trim(),
        disciplina: disciplina.trim(),
        ano: anoNumero,
      });

      // O código de convite é o que o professor vai compartilhar com os alunos
      Alert.alert(
        'Sala criada!',
        `Código de convite: ${novaSala.codigConvite}\n\nCompartilhe esse código com seus alunos.`
      );

      onSalaCriada(novaSala);
      limparCampos();
      onClose();
    } catch (error: any) {
      Alert.alert(
        'Erro ao criar sala',
        error.response?.data?.mensagem || 'Não foi possível criar a sala.'
      );
    } finally {
      setCriando(false);
    }
  };

  const handleFechar = () => {
    limparCampos();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleFechar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Criar nova sala</Text>

          <Text style={styles.label}>Nome da sala</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Desenvolvimento Web"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Disciplina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Programação Web"
            value={disciplina}
            onChangeText={setDisciplina}
          />

          <Text style={styles.label}>Ano</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2026"
            value={ano}
            onChangeText={setAno}
            keyboardType="numeric"
          />

          <View style={styles.botoes}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={handleFechar}
              disabled={criando}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoCriar]}
              onPress={handleCriar}
              disabled={criando}
            >
              {criando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.textoCriar}>Criar sala</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  label: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
  },
  botoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  botao: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCancelar: {
    backgroundColor: '#F1F3F5',
  },
  botaoCriar: {
    backgroundColor: '#155DFC',
  },
  textoCancelar: {
    color: '#495057',
    fontWeight: 'bold',
  },
  textoCriar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});