import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo suave da tela
    paddingHorizontal: 20,
    paddingTop: 40, // Ajuste para a StatusBar
  },
  header: {
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#777777',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20, 
  },
});