import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
    paddingTop: 80, 
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#007BFF',
  },
  descripcion: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  fecha: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});
