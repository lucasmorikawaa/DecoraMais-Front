import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { BotaoCriarSala } from './src/components/Button/BotaoCriarSala/BotaoCriarSala';
import { GestaoSalas } from './src/screens/GestaoSalas';
import { BancoDeCards } from './src/screens/BancoDeCards';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerRoutes } from './src/navigation/DrawerRoutes';
import { LoginScreen } from './src/screens/Login';
import { HomeAluno } from './src/screens/HomeAluno';

export default function App() {
  return (
    <HomeAluno />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
