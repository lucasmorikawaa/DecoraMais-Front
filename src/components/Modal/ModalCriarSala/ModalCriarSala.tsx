import React, { useState, useEffect } from 'react';
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
  salaParaEditar?: SalaDTO | null;
  onSalaAtualizada?: (sala: SalaDTO) => void;
}

export function ModalCriarSala({
  visible,
  onClose,
  onSalaCriada,
  salaParaEditar,
  onSalaAtualizada,
}: ModalCriarSalaProps) {
  const [nome, setNome] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [ano, setAno] = useState('');
  const [salvando, setSalvando] = useState(false);

  const modoEdicao = !!salaParaEditar;

  // Preenche os campos ao abrir em modo edição; limpa ao abrir em modo criação
  useEffect(() => {
    if (visible && salaParaEditar) {
      setNome(salaParaEditar.nome);
      setDisciplina(salaParaEditar.disciplina);
      setAno(String(salaParaEditar.ano));
    } else if (visible) {
      setNome('');
      setDisciplina('');
      setAno('');
    }
  }, [visible, salaParaEditar]);

  const handleSalvar = async () => {
    if (!nome.trim() || !disciplina.trim() || !ano.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, disciplina e ano.');
      return;
    }

    const anoNumero = parseInt(ano, 10);
    if (isNaN(anoNumero)) {
      Alert.alert('Ano inválido', 'Digite um ano válido, ex: 2026.');
      return;
    }

    const payload = {
      nome: nome.trim(),
      disciplina: disciplina.trim(),
      ano: anoNumero,
    };

    try {
      setSalvando(true);

      if (salaParaEditar) {
        const salaAtualizada = await salaService.atualizarSala(salaParaEditar.id, payload);
        Alert.alert('Sucesso', 'Sala atualizada com sucesso!');
        onSalaAtualizada?.(salaAtualizada);
      } else {
        const novaSala = await salaService.criarSala(payload);
        Alert.alert(
          'Sala criada!',
          `Código de convite: ${novaSala.codigConvite}\n\nCompartilhe esse código com seus alunos.`
        );
        onSalaCriada(novaSala);
      }

      onClose();
    } catch (error: any) {
      Alert.alert(
        modoEdicao ? 'Erro ao atualizar sala' : 'Erro ao criar sala',
        error.response?.data?.mensagem || 'Não foi possível salvar a sala.'
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.titulo}>{modoEdicao ? 'Editar sala' : 'Criar nova sala'}</Text>

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
              onPress={onClose}
              disabled={salvando}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoCriar]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.textoCriar}>{modoEdicao ? 'Salvar' : 'Criar sala'}</Text>
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