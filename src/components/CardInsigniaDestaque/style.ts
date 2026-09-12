import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBE6',
    borderWidth: 1.5,
    borderColor: '#FFD43B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCC419',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  descricao: {
    fontSize: 12,
    color: '#868E96',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  precoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#868E96',
  },
  badgeDisabled: {
    backgroundColor: '#CED4DA',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeDisabledText: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '600',
  },
});