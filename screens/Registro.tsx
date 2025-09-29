// RegistroScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { styles } from '../styles/LoginScreen.styles';

interface UsuarioResponse {
  success: boolean;
  error?: string;
  message?: string;
  usuario?: any;
}

export default function RegistroScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Función para redimensionar imagen si es muy grande
  const resizeImageIfNeeded = (base64: string): string => {
    // Si el base64 es mayor a 500KB, ya está bastante optimizado
    const sizeInKB = (base64.length * 3) / 4 / 1024; // Aproximación del tamaño real
    console.log(`Tamaño de imagen: ${Math.round(sizeInKB)} KB`);
    
    if (sizeInKB > 800) { // Si es mayor a 800KB
      console.warn('Imagen muy grande, considera reducir más la calidad');
    }
    
    return base64;
  };

  // Convertir imagen a base64
  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  };

  // Abrir cámara para tomar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permisos para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.3, // Reducir más la calidad (0.3 = 30%)
      base64: true,
      aspect: [1, 1], // Aspecto cuadrado
      exif: false, // No incluir metadatos EXIF
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPhotoUri(imageUri);
      
      try {
        setIsProcessing(true);
        // Usar el base64 que viene del ImagePicker
        if (result.assets[0].base64) {
          const optimizedBase64 = resizeImageIfNeeded(result.assets[0].base64);
          setPhotoBase64(optimizedBase64);
        } else {
          // Fallback: convertir manualmente
          const base64 = await convertToBase64(imageUri);
          const optimizedBase64 = resizeImageIfNeeded(base64);
          setPhotoBase64(optimizedBase64);
        }
        setIsProcessing(false);
        Alert.alert('Éxito', 'Rostro capturado correctamente');
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Error', 'No se pudo procesar la imagen');
        console.error(error);
      }
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setPhotoBase64(null);
  };

  // Registrar usuario con imagen en base64
  const handleRegistro = async () => {
    if (!nombre || !apellido || !password || !telefono || !email) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }
    if (!photoBase64) {
      Alert.alert('Foto requerida', 'Por favor captura tu rostro antes de registrarte.');
      return;
    }

    setIsProcessing(true);

    try {
      const userData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        password: password,
        telefono: telefono.trim(),
        correo: email.trim().toLowerCase(), // Cambio: email -> correo
        rostro: photoBase64, // Base64 de la imagen
        // Los timestamps created_at y updated_at se manejan automáticamente en el servidor
      };

      console.log('Enviando datos del usuario...');
      console.log('Datos a enviar:', {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        telefono: userData.telefono,
        tieneRostro: !!userData.rostro,
        tamaño_rostro_kb: userData.rostro ? Math.round(userData.rostro.length / 1024) : 0
      });
      
      const response = await fetch('https://apiabel.teamsystem.space/api/usuario/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      let data: UsuarioResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }

      try {
        const response = await fetch(
          "https://5aa392a65401.ngrok-free.app/registrar_rostro",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
              id_usuario: 24,
              imagen_base64: photoBase64
              }),
            }
        );
      
        const data = await response.json();
      } catch (error) {
        Alert.alert("No reconoce ningun rostro", error instanceof Error ? error.message : "Error desconocido");
      }

      if (data.success) {
        Alert.alert(
          'Registro exitoso', 
          `¡Bienvenido ${nombre} ${apellido}! Tu cuenta ha sido creada correctamente.`,
          [
            {
              text: 'Continuar',
              onPress: () => navigation.replace('MainTabs')
            }
          ]
        );
      } else {
        Alert.alert('Error al registrar', data.error || data.message || 'Intenta nuevamente');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput 
        placeholder="Nombre" 
        style={styles.input} 
        value={nombre} 
        onChangeText={setNombre} 
        placeholderTextColor="#aaa"
        autoCapitalize="words"
      />

      <TextInput 
        placeholder="Apellido" 
        style={styles.input} 
        value={apellido} 
        onChangeText={setApellido} 
        placeholderTextColor="#aaa"
        autoCapitalize="words"
      />
      
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput 
        placeholder="Contraseña" 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#aaa"
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Teléfono" 
        style={styles.input} 
        value={telefono} 
        onChangeText={setTelefono} 
        keyboardType="phone-pad" 
        placeholderTextColor="#aaa"
      />

      <View style={cameraStyles.photoSection}>
        <Text style={cameraStyles.sectionTitle}>Foto de Verificación</Text>
        
        {photoUri ? (
          <View style={cameraStyles.photoContainer}>
            <Image source={{ uri: photoUri }} style={cameraStyles.photoPreview} />
            <View style={cameraStyles.photoActions}>
              <TouchableOpacity 
                style={[styles.pedirBtn, { backgroundColor: '#FF6B6B', flex: 1, marginRight: 10 }]} 
                onPress={retakePhoto}
                disabled={isProcessing}
              >
                <Text style={styles.pedirBtnText}>🔄 Otra Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pedirBtn, { backgroundColor: '#4CAF50', flex: 1 }]} 
                onPress={handleRegistro}
                disabled={isProcessing || !photoBase64}
              >
                <Text style={styles.pedirBtnText}>✓ Usar Esta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.pedirBtn, { backgroundColor: '#2196F3' }]} 
            onPress={takePhoto}
            disabled={isProcessing}
          >
            <Text style={styles.pedirBtnText}>📸 Capturar Rostro</Text>
          </TouchableOpacity>
        )}
      </View>

      {!photoUri && (
        <TouchableOpacity 
          style={[styles.pedirBtn, { backgroundColor: '#ccc' }]} 
          disabled={true}
        >
          <Text style={[styles.pedirBtnText, { color: '#666' }]}>
            Primero captura tu foto
          </Text>
        </TouchableOpacity>
      )}

      <Text style={cameraStyles.statusText}>
        {isProcessing ? (
          '⏳ Procesando imagen...'
        ) : !photoBase64 ? (
          '👆 Captura tu rostro para continuar'
        ) : (
          '✅ Listo para registrarte'
        )}
      </Text>

      {/* Info sobre el tamaño de la imagen para debugging */}
      {photoBase64 && !isProcessing && (
        <Text style={cameraStyles.debugText}>
          📊 Tamaño de imagen: {Math.round(photoBase64.length / 1024)} KB
        </Text>
      )}
    </ScrollView>
  );
}

const cameraStyles = StyleSheet.create({
  photoSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoContainer: { 
    alignItems: 'center', 
    marginVertical: 15,
    width: '100%',
  },
  photoPreview: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    borderWidth: 4, 
    borderColor: '#00D2FF',
    marginBottom: 15,
  },
  photoActions: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  statusText: { 
    textAlign: 'center', 
    color: '#666', 
    fontSize: 14, 
    marginTop: 15,
    marginHorizontal: 20,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  debugText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'monospace',
  }
});