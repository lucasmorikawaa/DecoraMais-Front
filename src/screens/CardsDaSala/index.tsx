import React from 'react';
import { View, Text, TouchableOpacity, Share, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  id: string;
  periodo: string; // nome da sala
  materia: string; // disciplina
  ano: string;
  numAlunos: number;
  codigoConvite: string;
  onPressMenu?: () => void; // menu de opções (editar/excluir)
  onPressVerCards?: () => void; // abre a lista de cards da sala (opcional)
};

export function CardSala({
  periodo,
  materia,
  ano,
  numAlunos,
  codigoConvite,
  onPressMenu,
  onPressVerCards,
}: Props) {
  // Abre o menu de compartilhar do celular (WhatsApp, e-mail, etc.)
  const compartilharCodigo = async () => {
    try {
      await Share.share({
        message: `Entre na minha sala "${periodo}" no Decora+ com o código: ${codigoConvite}`,
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar o código.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <View style={styles.iconeBox}>
          <Feather name="book-open" size={22} color="#155DFC" />
        </View>

        <View style={styles.textos}>
          <Text style={styles.nome} numberOfLines={1}>
            {periodo}
          </Text>
          <Text style={styles.materia} numberOfLines={1}>
            {materia}
          </Text>
        </View>

        {onPressMenu && (
          <TouchableOpacity
            onPress={onPressMenu}
            hitSlop={10}
            style={styles.menu}
            accessibilityLabel="Opções da sala"
          >
            <Feather name="more-vertical" size={22} color="#495057" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Feather name="calendar" size={13} color="#495057" />
          <Text style={styles.chipTexto}>{ano}</Text>
        </View>
        <View style={styles.chip}>
          <Feather name="users" size={13} color="#495057" />
          <Text style={styles.chipTexto}>
            {numAlunos} {numAlunos === 1 ? 'aluno' : 'alunos'}
          </Text>
        </View>
      </View>

      {/* Código de convite */}
      <View style={styles.codigoBox}>
        <View>
          <Text style={styles.codigoRotulo}>Código de convite</Text>
          <Text style={styles.codigo}>{codigoConvite}</Text>
        </View>

        <TouchableOpacity style={styles.botaoCompartilhar} onPress={compartilharCodigo}>
          <Feather name="share-2" size={16} color="#155DFC" />
          <Text style={styles.botaoCompartilharTexto}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {onPressVerCards && (
        <TouchableOpacity style={styles.botaoVerCards} onPress={onPressVerCards}>
          <Feather name="layers" size={16} color="#FFFFFF" />
          <Text style={styles.botaoVerCardsTexto}>Ver cards</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CardSala;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textos: { flex: 1 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  materia: { fontSize: 13, color: '#868E96', marginTop: 2 },
  menu: { padding: 4 },

  chips: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipTexto: { fontSize: 12, fontWeight: '600', color: '#495057' },

  codigoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBE4FF',
    padding: 12,
    marginTop: 14,
  },
  codigoRotulo: { fontSize: 11, color: '#868E96', fontWeight: '600' },
  codigo: { fontSize: 18, fontWeight: 'bold', color: '#155DFC', letterSpacing: 2, marginTop: 2 },
  botaoCompartilhar: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
  botaoCompartilharTexto: { color: '#155DFC', fontSize: 13, fontWeight: '600' },

  botaoVerCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#155DFC',
    marginTop: 12,
  },
  botaoVerCardsTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});