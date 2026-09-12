import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    padding: 20,
    marginTop: 16, 
    width: '100%',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  periodoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  anoText: {
    fontSize: 14,
    color: '#777777', 
    marginBottom: 12,
  },
  materiaBadge: {
    backgroundColor: '#e0e0e0', 
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start', 
    marginBottom: 16,
  },
  materiaText: {
    fontSize: 12,
    color: '#555555',
  },
  alunosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alunosText: {
    fontSize: 14,
    color: '#555555',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    width: '100%',
    marginBottom: 16,
  },
  codigoTitle: {
    fontSize: 12,
    color: '#aaaaaa',
    marginBottom: 4,
  },
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5', 
  },
  codigoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
});