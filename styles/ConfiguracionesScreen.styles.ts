import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F3F',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00D2FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  opcionBtn: {
    backgroundColor: '#173c67',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  opcionText: {
    color: '#A0BFEF',
    fontSize: 18,
    fontWeight: '600',
  },
});
