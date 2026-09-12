import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BotaoCriarSala } from '../../components/Button/BotaoCriarSala/BotaoCriarSala';
import { CardSala } from '../../components/CardSala/CardSala';
import { ModalCriarSala } from '../../components/Modal/ModalCriarSala/ModalCriarSala';
import { CardSalaProps } from '../../components/CardSala/types';
import { styles } from './styles';

// Tipo que inclui o 'id' único para o FlatList
interface SalaData extends CardSalaProps {
  id: string;
}

export function GestaoSalas() {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estado que armazena a lista de cards de salas
  const [salas, setSalas] = useState<SalaData[]>([]);

  // Função auxiliar para gerar um código de convite aleatório (ex: DEC-8A92)
  const gerarCodigoConvite = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DEC-${code}`;
  };

  const handleCriarSala = (novosDados: { nome: string; disciplina: string; anoLetivo: string }) => {
    const novaSala: SalaData = {
      id: String(Date.now()), // ID único baseado no timestamp
      periodo: novosDados.nome,
      materia: novosDados.disciplina,
      ano: novosDados.anoLetivo,
      numAlunos: 0, // Inicia com 0 alunos por padrão
      codigoConvite: gerarCodigoConvite(),
    };

    // Adiciona a nova sala no topo da lista
    setSalas((prevSalas) => [novaSala, ...prevSalas]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={{ fontSize: 30 }}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Gestão de Salas</Text>
        <Text style={styles.subtitle}>Gerencie suas turmas e disciplinas</Text>
      </View>

      <BotaoCriarSala onPress={() => setModalVisible(true)} />

      {/* Lista de Cards Dinâmicos */}
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardSala
            periodo={item.periodo}
            ano={item.ano}
            materia={item.materia}
            numAlunos={item.numAlunos}
            codigoConvite={item.codigoConvite} id={''}          />
        )}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#868E96', fontSize: 14 }}>
              Nenhuma sala cadastrada ainda.
            </Text>
            <Text style={{ color: '#ADB5BD', fontSize: 12, marginTop: 4 }}>
              Clique em "+ Criar Sala" para adicionar.
            </Text>
          </View>
        )}
      />

      <ModalCriarSala
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCriarSala}
      />
    </View>
  );
}