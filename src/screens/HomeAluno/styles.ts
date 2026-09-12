import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  // Topo do Perfil e Gamificação
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  xpBadge: {
    backgroundColor: '#FFF9DB',
    borderWidth: 1,
    borderColor: '#FFE066',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  xpText: {
    color: '#F59F00',
    fontWeight: 'bold',
    fontSize: 13,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
  },
  streakSubtext: {
    fontSize: 12,
    color: '#868E96',
  },
  // Seção de Matérias
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#868E96',
    marginBottom: 16,
  },
  seeMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 32,
  },
  seeMoreText: {
    color: '#868E96',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // Seção de Ingressar em Sala
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212529',
  },
  enterButton: {
    backgroundColor: '#155DFC',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});