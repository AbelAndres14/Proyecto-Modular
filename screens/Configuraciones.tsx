import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/ConfiguracionesScreen.styles';

interface Props {
  navigation: any;
}

const opciones = [
  { id: '1', titulo: 'Ver Perfil', destino: 'Perfil' },
  { id: '2', titulo: 'Notificaciones', destino: 'Notificaciones' },
  { id: '3', titulo: 'Privacidad', destino: 'Privacidad' },
  { id: '4', titulo: 'Cerrar Sesión', destino: null },
];

export default function ConfiguracionesScreen({ navigation }: Props) {
  const handlePress = (destino: string | null) => {
    if (destino) {
      navigation.navigate(destino);
    } else {
      navigation.replace('Inicio');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraciones</Text>
      {opciones.map((opcion) => (
        <TouchableOpacity
          key={opcion.id}
          style={styles.opcionBtn}
          onPress={() => handlePress(opcion.destino)}
        >
          <Text style={styles.opcionText}>{opcion.titulo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
