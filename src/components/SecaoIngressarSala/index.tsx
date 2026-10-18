import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { salaService } from '../../services/sala';

type SalaDTO = Awaited<ReturnType<typeof salaService.buscarSalaPorCodigo>>;

type Props = { onIngressou?: (sala: SalaDTO) => void };

function extrairErro(e: any): string {
  if (!e?.response) return 'Não foi possível conectar ao servidor.';
  if (e.response.status === 404) return 'Nenhuma sala encontrada com esse código';
  return e.response.data?.mensagem || 'Erro ao buscar a sala.';
}

export function SecaoIngressarSala({ onIngressou }: Props) {
  const [codigo, setCodigo] = useState('');
  const [sala, setSala] = useState<SalaDTO | null>(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [ingressando, setIngressando] = useState(false);
  const [ingressou, setIngressou] = useState(false);

  const buscar = async () => {
    const c = codigo.trim().toUpperCase();
    if (!c) { setErro('Digite o código da sala'); setSala(null); return; }
    setBuscando(true); setErro(''); setSala(null); setIngressou(false);
    try {
      setSala(await salaService.buscarSalaPorCodigo(c));
    } catch (e) {
      setErro(extrairErro(e));
    } finally {
      setBuscando(false);
    }
  };

  const ingressar = () => {
    if (!sala) return;
    Alert.alert('Ingressar', `Deseja entrar na sala "${sala.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Ingressar',
        onPress: async () => {
          setIngressando(true);
          try {
            await salaService.ingressarNaSala(sala.codigConvite);
            setIngressou(true);
            onIngressou?.(sala);
          } catch (e: any) {
            Alert.alert('Erro', e?.response?.data?.mensagem || 'Não foi possível ingressar.');
          } finally {
            setIngressando(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingressar em uma sala</Text>
      <Text style={styles.subtitle}>Digite o código de convite fornecido pelo professor</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Código da sala"
          placeholderTextColor="#868E96"
          value={codigo}
          onChangeText={setCodigo}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={buscar}
        />
        <TouchableOpacity style={styles.button} onPress={buscar} disabled={buscando}>
          {buscando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Buscar</Text>}
        </TouchableOpacity>
      </View>

      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      {sala && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{sala.nome}</Text>
          <Text style={styles.cardText}>{sala.disciplina} • {sala.ano}</Text>
          {!!sala.professorNome && <Text style={styles.cardText}>Professor: {sala.professorNome}</Text>}
          {sala.quantidadeAlunos != null && (
            <Text style={styles.cardText}>{sala.quantidadeAlunos} aluno(s)</Text>
          )}
          {ingressou ? (
            <Text style={styles.ok}>Você está nesta sala ✓</Text>
          ) : (
            <TouchableOpacity style={[styles.button, styles.full]} onPress={ingressar} disabled={ingressando}>
              {ingressando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Ingressar nesta sala</Text>}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default SecaoIngressarSala;

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 13, color: '#868E96', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#F1F3F5', borderRadius: 10, paddingHorizontal: 12, height: 46, color: '#212529' },
  button: { backgroundColor: '#155DFC', borderRadius: 10, paddingHorizontal: 16, height: 46, justifyContent: 'center', alignItems: 'center' },
  full: { marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '600' },
  erro: { color: '#E03131', marginTop: 8, fontSize: 13 },
  card: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E9ECEF' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  cardText: { fontSize: 13, color: '#495057', marginTop: 4 },
  ok: { marginTop: 12, color: '#2F9E44', fontWeight: '600' },
});