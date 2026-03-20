import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type ConfirmacionViajeRouteProp = RouteProp<RootStackParamList, 'ConfirmacionViaje'>;

const STORAGE_KEY_RECIBIDO = 'viajeRecibidoPendiente';

export default function ConfirmacionViaje() {
  const route = useRoute<ConfirmacionViajeRouteProp>();
  const params = route.params;

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soyDestinatario, setSoyDestinatario] = useState(false);

  const [datosViaje, setDatosViaje] = useState({
    punto: params?.punto ?? '',
    objeto: params?.objeto ?? '',
    destinatario: params?.destinatario ?? '',
    estacion: params?.estacion ?? '',
    remitente: params?.remitente ?? '',
    fechaCreacion: params?.fechaCreacion ?? '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEY_RECIBIDO);
        if (guardado) {
          const viajeGuardado = JSON.parse(guardado);
          setDatosViaje(viajeGuardado);
          setSoyDestinatario(true);
        } else {
          setSoyDestinatario(false);
        }
      } catch (e) {
        console.error('Error leyendo AsyncStorage:', e);
      }
    };
    init();
  }, []);

  const convertToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // ✅ quitar prefijo data:image/...;base64, si existe
        const clean = result.includes(',') ? result.split(',')[1] : result;
        resolve(clean);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permisos para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.3,
      base64: true,
      aspect: [1, 1],
      exif: false,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setFotoUri(imageUri);

      try {
        setIsProcessing(true);
        // ✅ result.assets[0].base64 ya viene limpio sin prefijo
        const base64Data = result.assets[0].base64
          ? result.assets[0].base64
          : await convertToBase64(imageUri);
        setIsProcessing(false);
        Alert.alert('Éxito', 'Rostro capturado correctamente');
        await enviarRostro(base64Data);
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Error', 'No se pudo procesar la imagen');
        console.error(error);
      }
    }
  };

  const enviarRostro = async (base64Data: string) => {
    try {
      // ✅ leer y parsear el objeto user completo
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert("Error", "No se encontró la sesión del usuario");
        return;
      }
      const user = JSON.parse(userString);
      const idUsuario = parseInt(user.id, 10); // ✅ la API espera int

      const response = await fetch("https://aisai.abelandres.dpdns.org/validar_rostro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuario,  // ✅ int
          imagen_base64: base64Data, // ✅ sin prefijo
        }),
      });

      const data = await response.json();
      if (data.coincidencia) {
        await AsyncStorage.removeItem(STORAGE_KEY_RECIBIDO);
        Alert.alert("✅ Entregado", "Rostro validado. El viaje ha sido confirmado.");
      } else {
        Alert.alert("Error", "El rostro no coincide, intenta de nuevo");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo validar el rostro");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmación del viaje</Text>

      <View style={styles.card}>
        <Text style={styles.label}>De:</Text>
        <Text style={styles.info}>{datosViaje.remitente || '—'}</Text>

        <Text style={styles.label}>Ubicación origen:</Text>
        <Text style={styles.info}>{datosViaje.punto || '—'}</Text>

        <Text style={styles.label}>Objeto:</Text>
        <Text style={styles.info}>{datosViaje.objeto || '—'}</Text>

        <Text style={styles.label}>Estación destino:</Text>
        <Text style={styles.info}>{datosViaje.estacion || '—'}</Text>

        <Text style={styles.label}>Para:</Text>
        <Text style={styles.info}>{datosViaje.destinatario || '—'}</Text>

        {fotoUri && (
          <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
        )}
      </View>

      {soyDestinatario ? (
        <>
          <TouchableOpacity
            style={[styles.button, isProcessing && { backgroundColor: '#ccc' }]}
            onPress={takePhoto}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Procesando...' : '📸 Capturar Rostro'}
            </Text>
          </TouchableOpacity>
          {fotoUri && (
            <Text style={styles.infoText}>Foto lista para enviar al servidor</Text>
          )}
        </>
      ) : (
        <View style={styles.esperandoContainer}>
          <Text style={styles.esperandoTexto}>⏳ Esperando confirmación del destinatario</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  label: { fontSize: 14, color: '#555', marginTop: 10, fontWeight: '600' },
  info: { fontSize: 18, color: '#000', fontWeight: 'bold' },
  button: { backgroundColor: '#00D2FF', padding: 18, borderRadius: 12, width: '80%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  infoText: { marginTop: 10, fontStyle: 'italic', color: '#666' },
  photoPreview: { width: 120, height: 120, borderRadius: 60, marginTop: 15, alignSelf: 'center', borderWidth: 2, borderColor: '#00D2FF' },
  esperandoContainer: { marginTop: 10, padding: 14, backgroundColor: '#fff3cd', borderRadius: 12, width: '100%', alignItems: 'center' },
  esperandoTexto: { color: '#856404', fontSize: 15, fontWeight: '600' },
});