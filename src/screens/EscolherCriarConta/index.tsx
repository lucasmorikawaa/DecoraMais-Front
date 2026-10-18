import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export type TipoConta = 'ALUNO' | 'PROFESSOR';

type Props = {
  onContinuar: (tipo: TipoConta) => void;
  onVoltar: () => void;
};

const OPCOES: {
  tipo: TipoConta;
  titulo: string;
  descricao: string;
  icone: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  {
    tipo: 'ALUNO',
    titulo: 'Aluno',
    descricao: 'Entre em salas, revise flashcards e acompanhe sua evolução.',
    icone: 'school-outline',
  },
  {
    tipo: 'PROFESSOR',
    titulo: 'Professor',
    descricao: 'Crie salas, monte seu banco de cards e acompanhe o desempenho.',
    icone: 'human-male-board',
  },
];

export function EscolherCriarConta({ onContinuar, onVoltar }: Props) {
  const [selecionado, setSelecionado] = useState<TipoConta | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={onVoltar} hitSlop={10}>
        <Feather name="arrow-left" size={24} color="#212529" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.logo}>Decora+</Text>
        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Como você vai usar o Decora+?</Text>

        <View style={styles.cards}>
          {OPCOES.map((op) => {
            const ativo = selecionado === op.tipo;
            return (
              <TouchableOpacity
                key={op.tipo}
                activeOpacity={0.85}
                style={[styles.card, ativo && styles.cardAtivo]}
                onPress={() => setSelecionado(op.tipo)}
              >
                <View style={[styles.iconeBox, ativo && styles.iconeBoxAtivo]}>
                  <MaterialCommunityIcons
                    name={op.icone}
                    size={36}
                    color={ativo ? '#FFFFFF' : '#155DFC'}
                  />
                </View>

                <View style={styles.cardTextos}>
                  <Text style={styles.cardTitulo}>{op.titulo}</Text>
                  <Text style={styles.cardDescricao}>{op.descricao}</Text>
                </View>

                <View style={[styles.radio, ativo && styles.radioAtivo]}>
                  {ativo && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity
          style={[styles.botao, !selecionado && styles.botaoDesabilitado]}
          disabled={!selecionado}
          onPress={() => selecionado && onContinuar(selecionado)}
        >
          <Text style={styles.botaoTexto}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onVoltar} style={styles.linkLogin}>
          <Text style={styles.linkTexto}>
            Já tem uma conta? <Text style={styles.linkDestaque}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default EscolherCriarConta;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF', paddingHorizontal: 20 },
  voltar: { marginTop: 40, width: 40, height: 40, justifyContent: 'center' },
  content: { flex: 1, paddingTop: 12 },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#155DFC', marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  subtitulo: { fontSize: 16, color: '#868E96', marginTop: 6, marginBottom: 28 },
  cards: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    padding: 16,
  },
  cardAtivo: { borderColor: '#155DFC', backgroundColor: '#EDF2FF' },
  iconeBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeBoxAtivo: { backgroundColor: '#155DFC' },
  cardTextos: { flex: 1, marginHorizontal: 14 },
  cardTitulo: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  cardDescricao: { fontSize: 13, color: '#495057', marginTop: 4, lineHeight: 18 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CED4DA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioAtivo: { backgroundColor: '#155DFC', borderColor: '#155DFC' },
  rodape: { paddingBottom: 28 },
  botao: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: { backgroundColor: '#A5C0FB' },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkLogin: { alignItems: 'center', marginTop: 16 },
  linkTexto: { fontSize: 14, color: '#495057' },
  linkDestaque: { color: '#155DFC', fontWeight: '600' },
});