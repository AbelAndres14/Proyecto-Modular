import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/ConfiguracionesScreen.styles';

const opciones = [
  { id: '1', titulo: 'Ver Perfil' },
  { id: '2', titulo: 'Notificaciones' },
  { id: '3', titulo: 'Privacidad' },
  { id: '4', titulo: 'Cerrar Sesión' },
];

export default function ConfiguracionesScreen() {
  const handlePress = (titulo: string) => {
    Alert.alert(titulo, `Has seleccionado la opción "${titulo}"`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraciones</Text>
      {opciones.map((opcion) => (
        <TouchableOpacity
          key={opcion.id}
          style={styles.opcionBtn}
          onPress={() => handlePress(opcion.titulo)}
        >
          <Text style={styles.opcionText}>{opcion.titulo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
