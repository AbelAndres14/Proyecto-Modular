import React, { useState } from 'react';
import { styles } from '../styles/HomeScreen.styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

type CuadrosOpcionesProps = {
  data: string[];
  seleccion: string;
  setSeleccion: React.Dispatch<React.SetStateAction<string>>;
  titulo: string;
};

const CuadrosOpciones = ({ data, seleccion, setSeleccion, titulo }: CuadrosOpcionesProps) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{titulo}</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              if (seleccion === item) {
                setSeleccion(''); // Deselecciona si ya está seleccionado
              } else {
                setSeleccion(item);
              }
            }}
            style={{
              backgroundColor: seleccion === item ? '#8b0000ff' : '#007BFF55',
              borderColor: '#ffffff',
              borderWidth: 2,
              paddingVertical: 6,
              paddingHorizontal: 12,
              marginVertical: 5,
              borderRadius: 10,
              width: '47%',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function Home() {
  const objetos = [
    'Paquete pequeño',
    'Documento importante',
    'otro',
  ];

  const estaciones = [
    'Estación Norte',
    'Estación Sur',
    'Estación Este',
    'Estación Oeste',
  ];

  const [ubicacion, setUbicacion] = useState('');
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [destinatario, setDestinatario] = useState('');
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);

  const enviarViaje = () => {
    if (!ubicacion.trim() || !destinatario.trim() || !estacionSeleccionada) {
      Alert.alert('Faltan datos', 'Por favor, completa todos los campos.');
      return;
    }

    Alert.alert(
      'Viaje enviado',
      `📍 Desde: ${ubicacion}\n📦 Objeto: ${objetoSeleccionado}\n👤 Para: ${destinatario}\n📬 Estación: ${estacionSeleccionada}`
    );

    // Limpiar campos
    setUbicacion('');
    setDestinatario('');
    setObjetoSeleccionado(objetos[0]);
    setEstacionSeleccionada(estaciones[0]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Enviar un viaje al Robot</Text>

      <Text style={styles.label}>¿Dónde estás?</Text>
      <TextInput
        placeholder="Ej. Calle 456, Edificio B"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <CuadrosOpciones
        data={objetos}
        seleccion={objetoSeleccionado}
        setSeleccion={setObjetoSeleccionado}
        titulo="¿Qué vas a mandar?"
      />

      <Text style={styles.label}>¿A quién se lo vas a mandar?</Text>
      <TextInput
        placeholder="Nombre del destinatario"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        value={destinatario}
        onChangeText={setDestinatario}
      />

      <CuadrosOpciones
        data={estaciones}
        seleccion={estacionSeleccionada}
        setSeleccion={setEstacionSeleccionada}
        titulo="¿A dónde lo mandarás?"
      />

      <TouchableOpacity style={styles.pedirBtn} onPress={enviarViaje}>
        <Text style={styles.pedirBtnText}>Enviar Viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
