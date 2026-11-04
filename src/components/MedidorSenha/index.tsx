import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { avaliarSenha } from '../../utils/senhaForte';

const NIVEIS = {
  vazia: { label: '', cor: '#DEE2E6', barras: 0 },
  fraca: { label: 'Senha fraca', cor: '#FA5252', barras: 1 },
  media: { label: 'Senha média', cor: '#F5B800', barras: 2 },
  forte: { label: 'Senha forte', cor: '#51CF66', barras: 3 },
} as const;

export function MedidorSenha({ senha }: { senha: string }) {
  const { requisitos, nivel } = avaliarSenha(senha);
  const info = NIVEIS[nivel];

  if (senha.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.barras}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={[styles.barra, { backgroundColor: n <= info.barras ? info.cor : '#DEE2E6' }]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: info.cor }]}>{info.label}</Text>

      {requisitos.map((r) => (
        <View key={r.id} style={styles.linha}>
          <Feather
            name={r.ok ? 'check-circle' : 'circle'}
            size={15}
            color={r.ok ? '#51CF66' : '#ADB5BD'}
          />
          <Text style={[styles.texto, r.ok && styles.textoOk]}>{r.texto}</Text>
        </View>
      ))}
    </View>
  );
}

export default MedidorSenha;

const styles = StyleSheet.create({
  container: { marginTop: 8, marginBottom: 4 },
  barras: { flexDirection: 'row', gap: 6 },
  barra: { flex: 1, height: 6, borderRadius: 3 },
  label: { fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 6 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  texto: { fontSize: 13, color: '#868E96' },
  textoOk: { color: '#2F9E44' },
});