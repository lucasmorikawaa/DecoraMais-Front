import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api'; // Ajuste o caminho da sua instância Axios

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [usuario, setUsuario] = useState({ nome: '', email: '', tipo: '' });
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados do usuário autenticado no Spring Boot
  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true);
        const response = await api.get('/auth/me');
        setUsuario({
          nome: response.data.nome || '',
          email: response.data.email || '',
          tipo: response.data.tipo || '',
        });
      } catch (error) {
        console.log('Erro ao carregar dados do usuário no Drawer:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  // 2. Extrai as iniciais do nome (ex: "Lucas Morikawa" -> "LM")
  const obterIniciais = (nome: string) => {
    if (!nome) return 'U';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // 3. Executa a limpeza do token e redireciona para a tela de Login
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@DecoraPlus:token');
      // Redireciona para o fluxo de autenticação/login
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (error) {
      console.log('Erro ao realizar logout:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        
        {/* Topo / Header do Drawer */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Decora+</Text>
            <Text style={styles.subtitleText}>
              {usuario.tipo ? `Painel de ${usuario.tipo.toLowerCase()}` : 'Painel do Usuário'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Feather name="x" size={22} color="#6C757D" />
          </TouchableOpacity>
        </View>

        {/* Lista das Rotas/Links */}
        <View style={styles.itemListContainer}>
          <DrawerItemList {...props} />
        </View>

      </DrawerContentScrollView>

      {/* Rodapé fixo com Perfil do Usuário e Logout */}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" color="#155DFC" style={{ flex: 1 }} />
        ) : (
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{obterIniciais(usuario.nome)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>
                {usuario.nome || 'Usuário'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {usuario.email || 'email@exemplo.com'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color="#6C757D" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#155DFC',
  },
  subtitleText: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 4,
  },
  itemListContainer: {
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#155DFC',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529',
  },
  userEmail: {
    fontSize: 11,
    color: '#868E96',
  },
  logoutButton: {
    padding: 8,
  },
});