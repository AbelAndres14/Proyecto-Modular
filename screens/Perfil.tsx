import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Perfil.styles';

export default function PerfilScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error leyendo usuario de AsyncStorage:', error);
      }
    };
    loadUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con avatar, nombre y correo */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.nombre}</Text>
        <Text style={styles.email}>{user.correo}</Text>
      </View>

      {/* Información adicional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{user.telefono}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{user.correo}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>Guadalajara, México</Text>
        </View>
      </View>

      {/* Botón editar perfil */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => alert('Editar perfil próximamente')}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
