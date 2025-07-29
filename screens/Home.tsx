import React, { useState } from 'react';
import { styles } from '../styles/HomeScreen.styles';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';


const objetos = [
  'Paquete pequeño',
  'Paquete mediano',
  'Paquete grande',
  'Documento importante',
  'Comida',
];

export default function Home() {
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [direccion, setDireccion] = useState('');

  const pedirViaje = () => {
    if (!direccion.trim()) {
      Alert.alert('Error', 'Por favor, ingresa la dirección de entrega');
      return;
    }
    Alert.alert('Pedido enviado', `El robot llevará un "${objetoSeleccionado}" a:\n${direccion}`);
    setDireccion('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pide un viaje al Robot</Text>

      <Text style={styles.label}>Selecciona el objeto a entregar:</Text>
      <View style={styles.objetosContainer}>
        {objetos.map((objeto) => (
          <TouchableOpacity
            key={objeto}
            style={[
              styles.objetoBtn,
              objetoSeleccionado === objeto && styles.objetoBtnSelected,
            ]}
            onPress={() => setObjetoSeleccionado(objeto)}
          >
            <Text
              style={[
                styles.objetoBtnText,
                objetoSeleccionado === objeto && styles.objetoBtnTextSelected,
              ]}
            >
              {objeto}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Dirección de entrega:</Text>
      <TextInput
        placeholder="Ej. Calle 123, Edificio A, Ciudad"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
      />

      <TouchableOpacity style={styles.pedirBtn} onPress={pedirViaje}>
        <Text style={styles.pedirBtnText}>Pedir Viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
