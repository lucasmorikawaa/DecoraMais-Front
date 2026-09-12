import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#00C853', 
  },
  completedCircle: {
    backgroundColor: '#00C853',
  },
  line: {
    width: 40,
    height: 3,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 8,
  },
  activeLine: {
    backgroundColor: '#00C853',
  },
  iconText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeIconText: {
    color: '#FFFFFF',
  },
});