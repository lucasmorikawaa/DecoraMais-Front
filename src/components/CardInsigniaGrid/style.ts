import { StyleSheet, Dimensions } from 'react-native';

const cardWidth = (Dimensions.get('window').width - 52) / 2;

export const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  precoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnComprar: {
    backgroundColor: '#51CF66',
  },
  btnEquipar: {
    backgroundColor: '#00A3FF',
  },
  btnEquipado: {
    backgroundColor: '#E9ECEF',
  },
  btnDisabled: {
    backgroundColor: '#CED4DA',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buttonTextEquipado: {
    color: '#495057',
  },
});