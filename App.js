import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { DrawerRoutes } from './src/navigation/DrawerRoutes';
import { LoginScreen } from './src/screens/Login';
import { HomeAluno } from './src/screens/HomeAluno';

export default function App() {
  // Guarda o usuário logado (id, nome, email, tipo, ...).
  // Enquanto for null, mostramos a tela de Login.
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Ainda não logou -> mostra a tela de Login.
  // O LoginScreen chama isso passando os dados do usuário assim que o login der certo.
  if (!usuarioLogado) {
    return (
      <LoginScreen
        onLoginSuccess={(usuario) => setUsuarioLogado(usuario)}
      />
    );
  }

  // Logou como PROFESSOR -> vai para o Drawer de Gestão de Salas.
  if (usuarioLogado.tipo === 'PROFESSOR') {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <DrawerRoutes />
      </NavigationContainer>
    );
  }

  // Logou como ALUNO -> vai para a Home do Aluno.
  return (
    <>
      <StatusBar style="auto" />
      <HomeAluno />
    </>
  );
}