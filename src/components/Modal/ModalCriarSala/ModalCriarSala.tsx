import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

interface ModalCriarSalaProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (dados: { nome: string; disciplina: string; anoLetivo: string }) => void;
}

export function ModalCriarSala({ visible, onClose, onSubmit }: ModalCriarSalaProps) {
  const [nome, setNome] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [anoLetivo, setAnoLetivo] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = () => {
    // Validação de todos os campos obrigatórios
    if (!nome.trim() || !disciplina.trim() || !anoLetivo.trim()) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setErro('');
    onSubmit({
      nome: nome.trim(),
      disciplina: disciplina.trim(),
      anoLetivo: anoLetivo.trim(),
    });

    // Reset dos campos
    setNome('');
    setDisciplina('');
    setAnoLetivo('');
    onClose();
  };

  const handleClose = () => {
    setErro('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Criar Nova Sala</Text>

          {erro ? <Text style={modalStyles.erroText}>{erro}</Text> : null}

          <Text style={modalStyles.label}>Período / Nome da Turma *</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Noite - Turma A"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={modalStyles.label}>Matéria / Disciplina *</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Programação Mobile"
            value={disciplina}
            onChangeText={setDisciplina}
          />

          <Text style={modalStyles.label}>Ano Letivo / Semestre *</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: 2026 / 1º Semestre"
            value={anoLetivo}
            onChangeText={setAnoLetivo}
          />

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.btnCancel} onPress={handleClose}>
              <Text style={modalStyles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.btnSubmit} onPress={handleSubmit}>
              <Text style={modalStyles.btnSubmitText}>Criar Sala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F8F9FA',
  },
  erroText: {
    color: '#E03131',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
  },
  btnCancelText: {
    color: '#495057',
    fontWeight: '600',
  },
  btnSubmit: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#155DFC',
  },
  btnSubmitText: {
    color: '#FFF',
    fontWeight: '600',
  },
});