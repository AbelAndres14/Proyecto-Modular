import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F3F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00D2FF',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0BFEF',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: width * 0.8,
    paddingVertical: 16,
    borderRadius: 30,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  loginButton: {
    backgroundColor: '#00D2FF',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#00D2FF',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#0B1F3F',
    fontWeight: '700',
    fontSize: 18,
  },
  registerButtonText: {
    color: '#00D2FF',
  },
  footer: {
    color: '#3D5470',
    marginTop: 50,
    fontSize: 14,
    letterSpacing: 1,
  },



  
});
