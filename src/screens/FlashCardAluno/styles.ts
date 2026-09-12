import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  placeholderView: {
    width: 24,
  },
  // Barra de Progresso
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#155DFC',
    borderRadius: 4,
  },
  // Card de Flashcard
  cardContainer: {
    flex: 1,
    maxHeight: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  cardTag: {
    position: 'absolute',
    top: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  cardTagPergunta: {
    color: '#6C757D',
  },
  cardTagResposta: {
    color: '#155DFC',
  },
  cardTextMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  cardTextSub: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
  },
  // Botões de Avaliação
  actionsContainer: {
    gap: 10,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnNaoLembro: {
    backgroundColor: '#FF5252',
  },
  btnDificil: {
    backgroundColor: '#FCC419',
  },
  btnRegular: {
    backgroundColor: '#4DABF7',
  },
  btnFacil: {
    backgroundColor: '#51CF66',
  },
  btnLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnXpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
});