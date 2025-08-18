import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F3F',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#00D2FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#142A4F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  objeto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  estado: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  entregado: {
    backgroundColor: '#00FFAA',
    color: '#003322',
  },
  enCamino: {
    backgroundColor: '#FFD700',
    color: '#332200',
  },
  cancelado: {
    backgroundColor: '#FF5555',
    color: '#330000',
  },
  direccion: {
    color: '#A0BFEF',
    fontSize: 14,
    marginTop: 4,
  },
  fecha: {
    color: '#5E7AAB',
    fontSize: 12,
    marginTop: 2,
  },
  verMasBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#00D2FF22',
  },
  verMasText: {
    color: '#00D2FF',
    fontWeight: '600',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  cerrarBtn: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  cerrarBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
