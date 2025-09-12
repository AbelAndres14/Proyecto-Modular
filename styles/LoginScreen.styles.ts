// LoginScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginVertical: 8, backgroundColor: '#fff', color: '#000' },
  button: { padding: 15, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  loginButton: { backgroundColor: '#007BFF' },
  registerButton: { backgroundColor: '#fff', borderColor: '#007BFF', borderWidth: 1 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  registerButtonText: { color: '#007BFF' },
  pedirBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  pedirBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { marginTop: 40, textAlign: 'center', color: '#aaa', fontSize: 12 },
});
