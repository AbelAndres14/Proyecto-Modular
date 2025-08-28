import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styles } from '../styles/LoginScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginFormScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');


const handleLogin = async () => {
  if (!correo || !password) {
    Alert.alert('Campos incompletos', 'Por favor ingresa correo y contraseña.');
    return;
  }

  try {
    const response = await fetch('https://api-abel.teamsystem.space/api/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.success) {
      // 🔹 Guardar usuario en AsyncStorage para usar en PerfilScreen
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      Alert.alert('Bienvenido', `Hola, ${data.user.nombre}`);
      navigation.replace('MainTabs'); // Va a la app principal
    } else {
      Alert.alert('Error', data.error || 'Correo o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    Alert.alert('Error', 'No se pudo conectar al servidor');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      

      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
