import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function ConfirmacionViaje() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Función opcional para optimizar base64 (puedes adaptarla)
  const resizeImageIfNeeded = (base64: string) => {
    // Aquí podrías comprimir o recortar la imagen si quieres
    return base64;
  };

  const convertToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  // Abrir cámara y capturar rostro
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
      setPhotoUri(imageUri);

      try {
        setIsProcessing(true);
        let base64Data = '';
        if (result.assets[0].base64) {
          base64Data = resizeImageIfNeeded(result.assets[0].base64);
        } else {
          base64Data = resizeImageIfNeeded(await convertToBase64(imageUri));
        }
        setPhotoBase64(base64Data);
        setIsProcessing(false);
        Alert.alert('Éxito', 'Rostro capturado correctamente');

        // Enviar al endpoint
        await enviarRostro(base64Data);
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Error', 'No se pudo procesar la imagen');
        console.error(error);
      }
    }
  };

  /*const enviarRostro = async (base64Data: string) => {
    try {
      const response = await fetch("https://pyrophoric-tribrachial-roxana.ngrok-free.dev/validar_rostro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: 51, // reemplaza por el ID real
          imagen_base64: base64Data
        }),
      });

      const data = await response.json();
      if (data.coincidencia) {
        Alert.alert('Éxito', 'Rostro coincide con el usuario');
      } 
    } catch (error) {
      console.error(error);
    }
  };*/

const enviarRostro = async (base64Data: string) => {
  try {
    const idUsuario = await AsyncStorage.getItem("id_usuario"); // lo obtienes dinámico
    if (!idUsuario) {
      Alert.alert("Error", "No se encontró el ID del usuario");
      return;
    }

    const response = await fetch("https://pyrophoric-tribrachial-roxana.ngrok-free.dev/validar_rostro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: idUsuario,   // ✅ dinámico
        imagen_base64: base64Data,
      }),
    });

    const data = await response.json();
    if (data.coincidencia) {
      Alert.alert("Éxito", "Rostro coincide con el usuario");
    } else {
      Alert.alert("Error", "El rostro no coincide");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo validar el rostro");
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmación de Viaje</Text>

      <TouchableOpacity
        style={[styles.button, isProcessing && { backgroundColor: '#ccc' }]}
        onPress={takePhoto}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>{isProcessing ? 'Procesando...' : '📸 Capturar Rostro'}</Text>
      </TouchableOpacity>

      {photoUri && <Text style={styles.info}>Foto lista para enviar al servidor</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#00D2FF', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { marginTop: 10, fontStyle: 'italic', color: '#666' },
});
