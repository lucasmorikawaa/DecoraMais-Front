import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        
        {/* Topo / Header do Drawer */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Decora+</Text>
            <Text style={styles.subtitleText}>Painel de Professor</Text>
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
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JA</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>Prof. Julio</Text>
            <Text style={styles.userEmail} numberOfLines={1}>julioaguiar@fatec.sp.gov</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => console.log('Logout executado')}
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