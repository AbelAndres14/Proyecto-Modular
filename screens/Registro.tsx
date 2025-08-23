import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { styles } from '../styles/LoginScreen.styles';

export default function RegistroScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null); // Cambiado a any para evitar error TS
  const [cameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setCameraVisible(false);
    }
  };

const handleRegistro = async () => {
  if (!nombre || !apellido || !telefono || !correo) {
    Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
    return;
  }

  try {
    const userData = {
      nombre: nombre + ' ' + apellido,
      email: correo,  // Cambiado de "correo" a "email"
      password: telefono,
      images: photoUri || '' // Agrega la imagen si existe
    };

    // ✅ PUERTO 3337
    const response = await fetch('http://192.168.33.35:3337/api/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.success) {
      Alert.alert('Registro exitoso', `Bienvenido, ${nombre} ${apellido}`);
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Error al registrar', data.error || 'Intenta nuevamente');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    Alert.alert('Error', 'No se pudo conectar al servidor');
  }
};


  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permiso de cámara...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No se concedió permiso para usar la cámara.</Text></View>;
  }

  if (cameraVisible) {
    return (
      <View style={{ flex: 1 }}>
        {/* @ts-ignore */}
        <Camera style={{ flex: 1 }} ref={cameraRef} type={Camera.Constants.Type.front}>
          <View style={cameraStyles.cameraControls}>
            <TouchableOpacity style={cameraStyles.captureButton} onPress={takePhoto}>
              <Text style={cameraStyles.captureText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[cameraStyles.captureButton, { backgroundColor: 'red', marginTop: 10 }]}
              onPress={() => setCameraVisible(false)}
            >
              <Text style={cameraStyles.captureText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} placeholderTextColor="#aaa" />
      <TextInput placeholder="Apellido" style={styles.input} value={apellido} onChangeText={setApellido} placeholderTextColor="#aaa" />
      <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholderTextColor="#aaa" />
      <TextInput placeholder="Correo" style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" placeholderTextColor="#aaa" />

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: 200, height: 200, borderRadius: 100, marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={styles.pedirBtn} onPress={() => setCameraVisible(true)}>
          <Text style={styles.pedirBtnText}>Capturar Rostro</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.pedirBtn} onPress={handleRegistro}>
        <Text style={styles.pedirBtnText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const cameraStyles = StyleSheet.create({
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  captureButton: {
    backgroundColor: '#00D2FF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  captureText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
