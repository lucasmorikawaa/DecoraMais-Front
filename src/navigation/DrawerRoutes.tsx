import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

// Importação das suas Telas
import { GestaoSalas } from '../screens/GestaoSalas';
import { BancoDeCards } from '../screens/BancoDeCards';
import { Configuracoes } from '../screens/Configuracao';

// Componente Customizado que criamos no Passo 3
import { CustomDrawerContent } from '../components/CustomDrawer/CustomDrawer';

const Drawer = createDrawerNavigator();

export function DrawerRoutes() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Mostra o botão hambúrguer nativo no topo das telas
        headerTintColor: '#000000',
        headerStyle: {
          backgroundColor: '#F8F9FA',
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerActiveBackgroundColor: '#EDF2FF', // Fundo suave para o item ativo
        drawerActiveTintColor: '#155DFC',       // Texto/Ícone do item ativo
        drawerInactiveTintColor: '#495057',     // Texto/Ícone inativo
        drawerItemStyle: {
          borderRadius: 12,
          paddingHorizontal: 8,
          marginBottom: 4,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: -16, // Ajusta o espaçamento entre o ícone e o texto
        },
      }}
    >
      <Drawer.Screen
        name="Salas"
        component={GestaoSalas}
        options={{
          drawerLabel: 'Salas',
          title: '', // Remove o título do header para manter a tela limpa
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="BancoDeCards"
        component={BancoDeCards}
        options={{
          drawerLabel: 'Banco de cards',
          title: '',
          drawerIcon: ({ color, size }) => (
            <Feather name="layers" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Configuracoes"
        component={Configuracoes}
        options={{
          drawerLabel: 'Configurações',
          title: '',
          drawerIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}