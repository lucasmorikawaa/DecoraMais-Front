import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';

type CustomDrawerProps = DrawerContentComponentProps & {
  onLogout: () => void;
};

type UsuarioMe = { nome: string; email: string };

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const a = partes[0]?.[0] ?? '';
  const b = partes.length > 1 ? partes[1][0] : partes[0]?.[1] ?? '';
  return (a + b).toUpperCase();
}

export function CustomDrawerContent({ onLogout, ...props }: CustomDrawerProps) {
  const [usuario, setUsuario] = useState<UsuarioMe | null>(null);

  useEffect(() => {
    api
      .get('/usuarios/me')
      .then(({ data }) => setUsuario({ nome: data.nome, email: data.email }))
      .catch(() => {});
  }, []);

  const confirmarSaida = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] ?? '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Decora+</Text>
          <Text style={styles.subtitulo}>Painel de Professor</Text>
        </View>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()} hitSlop={10}>
          <Feather name="x" size={24} color="#495057" />
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <View style={styles.perfil}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>
              {usuario ? iniciais(usuario.nome) : ''}
            </Text>
          </View>
          <View style={styles.perfilTextos}>
            <Text style={styles.nome} numberOfLines={1}>
              {usuario ? `Prof. ${primeiroNome}` : ''}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {usuario?.email ?? ''}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sair} onPress={confirmarSaida} hitSlop={10}>
          <Feather name="log-out" size={24} color="#495057" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#155DFC' },
  subtitulo: { fontSize: 14, color: '#868E96', marginTop: 2 },
  scroll: { paddingTop: 16, paddingHorizontal: 8 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  perfil: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BAD0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: { color: '#155DFC', fontWeight: 'bold', fontSize: 14 },
  perfilTextos: { marginLeft: 12, flex: 1 },
  nome: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  email: { fontSize: 13, color: '#212529' },
  sair: { alignSelf: 'flex-end', marginTop: 12 },
});