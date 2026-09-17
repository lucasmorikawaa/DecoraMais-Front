import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    marginBottom: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  flexInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  helperText: {
    fontSize: 11,
    color: '#868E96',
    marginBottom: 20,
  },
  
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CED4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#6C757D',
    borderColor: '#6C757D',
  },
  salaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  salaSubtitle: {
    fontSize: 12,
    color: '#6C757D',
  },
  
  previewCard: {
    backgroundColor: '#EDF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAC8FF',
    padding: 16,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B52D9',
    marginTop: 8,
  },
  previewText: {
    fontSize: 13,
    color: '#212529',
    marginTop: 2,
  },
  
  buttonPrimary: {
    backgroundColor: '#155DFC',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSecondaryText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
});