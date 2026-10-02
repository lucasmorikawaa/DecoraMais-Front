import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#212529',
  },
  enterButton: {
    height: 48,
    backgroundColor: '#155DFC',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Modal Estilos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  salaDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 6,
  },
  salaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155DFC',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#495057',
  },
  detailBold: {
    fontWeight: '600',
    color: '#212529',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#155DFC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});