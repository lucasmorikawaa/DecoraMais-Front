import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DrawerRoutes } from "./src/navigation/DrawerRoutes";
import { LoginScreen } from "./src/screens/Login";
import { AlunoRoutes } from "./src/navigation/AlunoRoutes";
import { EscolherCriarConta } from "./src/screens/EscolherCriarConta";
import { CriarConta } from "./src/screens/CriarConta";

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  // 'login' | 'escolherCriarConta' | 'criarConta'
  const [telaAuth, setTelaAuth] = useState("login");
  const [tipoCadastro, setTipoCadastro] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@DecoraPlus:token");
    } finally {
      setUsuarioLogado(null);
      setTelaAuth("login");
      setTipoCadastro(null);
    }
  };

  if (!usuarioLogado) {
    if (telaAuth === "criarConta" && tipoCadastro) {
      return (
        <CriarConta
          tipo={tipoCadastro}
          onVoltar={() => setTelaAuth("escolherCriarConta")}
          onCadastroSuccess={(usuario) => setUsuarioLogado(usuario)}
        />
      );
    }

    if (telaAuth === "escolherCriarConta") {
      return (
        <EscolherCriarConta
          onVoltar={() => setTelaAuth("login")}
          onContinuar={(tipo) => {
            setTipoCadastro(tipo);
            setTelaAuth("criarConta");
          }}
        />
      );
    }

    return (
      <LoginScreen
        onLoginSuccess={(usuario) => setUsuarioLogado(usuario)}
        onNavigateToRegister={() => setTelaAuth("escolherCriarConta")}
      />
    );
  }

  if (usuarioLogado.tipo === "PROFESSOR") {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <DrawerRoutes onLogout={handleLogout} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AlunoRoutes />
    </NavigationContainer>
  );
}