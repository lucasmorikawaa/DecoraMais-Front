
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import { GestaoSalas } from '../screens/GestaoSalas';
import { BancoDeCards } from '../screens/BancoDeCards';
import RelatorioDesempenho from '../screens/RelatorioDesempenho';
import { Configuracoes } from '../screens/Configuracao';

import { CustomDrawerContent } from '../components/CustomDrawer/CustomDrawer';

const Drawer = createDrawerNavigator();

type DrawerRoutesProps = {
  onLogout: () => void;
};

export function DrawerRoutes({ onLogout }: DrawerRoutesProps) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000000',
        headerStyle: {
          backgroundColor: '#F8F9FA',
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerActiveBackgroundColor: '#EDF2FF',
        drawerActiveTintColor: '#155DFC',
        drawerInactiveTintColor: '#495057',
        drawerItemStyle: {
          borderRadius: 12,
          paddingHorizontal: 8,
          marginBottom: 4,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: 12,
        },
      }}
    >
      <Drawer.Screen
        name="Salas"
        component={GestaoSalas}
        options={{
          drawerLabel: 'Salas',
          title: '',
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
        name="RelatorioDesempenho"
        component={RelatorioDesempenho}
        options={{
          drawerLabel: 'Relatório de Desempenho',
          title: '',
          drawerIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
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
