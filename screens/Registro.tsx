// RegistroScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/LoginScreen.styles';

interface UsuarioResponse {
  success: boolean;
  error?: string;
  message?: string;
  usuario?: any;
}

interface RostroResponse {
  success: boolean;
  error?: string;
  message?: string;
  rostroId?: string;
}

export default function RegistroScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Abrir cámara para tomar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permisos para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const retakePhoto = () => setPhotoUri(null);

  // Subir foto al servidor
  const uploadPhoto = async (uri: string) => {
    if (!uri) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('rostro_image', { uri, type: 'image/jpeg', name: 'rostro.jpg' } as any);
      formData.append('timestamp', new Date().toISOString());
      formData.append('correo', correo);

      const response = await fetch('http://192.168.33.30:3008/api/rostro/', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data: RostroResponse = await response.json();
      if (data.success) Alert.alert('Éxito', 'Rostro registrado correctamente');
      else Alert.alert('Error', data.error || 'No se pudo registrar el rostro');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo enviar el rostro al servidor');
    } finally {
      setIsUploading(false);
    }
  };

  // Registrar usuario
  const handleRegistro = async () => {
    if (!nombre || !apellido || !telefono || !correo || !password) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Foto requerida', 'Por favor captura tu rostro antes de registrarte.');
      return;
    }

    try {
      const userData = { nombre, apellido, telefono, correo, password };
      const response = await fetch('http://192.168.33.30:3008/api/usuario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data: UsuarioResponse = await response.json();
      if (data.success) {
        Alert.alert('Registro exitoso', `Bienvenido, ${nombre} ${apellido}`);
        navigation.replace('MainTabs');
      } else Alert.alert('Error al registrar', data.error || 'Intenta nuevamente');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} placeholderTextColor="#aaa" />
      <TextInput placeholder="Apellido" style={styles.input} value={apellido} onChangeText={setApellido} placeholderTextColor="#aaa" />
      <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholderTextColor="#aaa" />
      <TextInput placeholder="Correo" style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" placeholderTextColor="#aaa" />
      <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#aaa" />

      {photoUri ? (
        <View style={cameraStyles.photoContainer}>
          <Image source={{ uri: photoUri }} style={cameraStyles.photoPreview} />
          <TouchableOpacity style={[styles.pedirBtn, { backgroundColor: '#FF6B6B', marginTop: 10 }]} onPress={retakePhoto}>
            <Text style={styles.pedirBtnText}>Tomar Otra</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.pedirBtn} onPress={takePhoto}>
          <Text style={styles.pedirBtnText}>📸 Capturar Rostro</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.pedirBtn, (!photoUri || isUploading) && { backgroundColor: '#ccc' }]} onPress={handleRegistro} disabled={!photoUri || isUploading}>
        <Text style={styles.pedirBtnText}>{isUploading ? 'Procesando...' : 'Registrarse'}</Text>
      </TouchableOpacity>

      <Text style={cameraStyles.statusText}>
        {!photoUri ? '👆 Primero captura tu rostro para continuar' : '✅ Rostro capturado - Listo para registrar'}
      </Text>
    </ScrollView>
  );
}

const cameraStyles = StyleSheet.create({
  photoContainer: { alignItems: 'center', marginVertical: 20 },
  photoPreview: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: '#00D2FF' },
  statusText: { textAlign: 'center', color: '#666', fontSize: 14, marginTop: 10, fontStyle: 'italic' },
});
