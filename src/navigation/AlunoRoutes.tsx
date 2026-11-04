import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { HomeAluno } from "../screens/HomeAluno";
import { TodasMateriasScreen } from "../screens/MateriasAlunos";
import { LojaInsignias } from "../screens/LojaInsignias";
import { Configuracoes } from "../screens/Configuracao";

const Tab = createBottomTabNavigator();

type Props = {
  onLogout: () => void;
};

export function AlunoRoutes({ onLogout }: Props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#155DFC",
        tabBarInactiveTintColor: "#687386",

        tabBarStyle: {
          height: 75,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },

        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "500",
        },

        tabBarIcon: ({ color, focused, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Materiais":
              iconName = focused ? "book" : "book-outline";
              break;

            case "Loja":
              iconName = focused ? "storefront" : "storefront-outline";
              break;

            case "Perfil":
              iconName = focused ? "person" : "person-outline";
              break;

            default:
              iconName = "ellipse-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size + 2}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeAluno}
        options={{
          tabBarLabel: "Home",
        }}
      />

      <Tab.Screen
        name="Materiais"
        component={TodasMateriasScreen}
        options={{
          tabBarLabel: "Materiais",
        }}
      />

      {/* A seta de voltar da loja leva de volta para a Home */}
      <Tab.Screen
        name="Loja"
        options={{
          tabBarLabel: "Loja",
        }}
      >
        {({ navigation }) => (
          <LojaInsignias onGoBack={() => navigation.navigate("Home")} />
        )}
      </Tab.Screen>

      {/* Recebe o onLogout para o botão "Sair da conta" */}
      <Tab.Screen
        name="Perfil"
        options={{
          tabBarLabel: "Perfil",
        }}
      >
        {() => <Configuracoes onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}