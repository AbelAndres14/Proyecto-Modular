import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/Perfil.styles';

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Abel Andres Hernández</Text>
        <Text style={styles.email}>abel@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>+52 333 222 1906</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>Guadalajara, México</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => alert('Editar perfil próximamente')}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
