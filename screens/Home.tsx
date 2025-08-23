import React, { useState } from 'react';
import { styles } from '../styles/HomeScreen.styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Dimensions,
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
  const objetos = ['Paquete pequeño', 'Documento importante', 'otro'];
  const estaciones = ['Estación Norte', 'Estación Sur', 'Estación Este', 'Estación Oeste'];

  const [ubicacion, setUbicacion] = useState('');
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [destinatario, setDestinatario] = useState('');
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('');

  // Puntos de interés en el mapa (coordenadas relativas a la imagen)
  const puntos = [
    { x: 50, y: 100, nombre: 'Módulo A' },
    { x: 150, y: 180, nombre: 'Módulo B' },
    { x: 250, y: 120, nombre: 'Auditorio' },
    { x: 350, y: 300, nombre: 'Biblioteca CID' },
    { x: 450, y: 220, nombre: 'Área de comida' },
  ];

  const enviarViaje = () => {
    if (!puntoSeleccionado || !destinatario.trim() || !estacionSeleccionada) {
      Alert.alert('Faltan datos', 'Por favor, completa todos los campos.');
      return;
    }

    Alert.alert(
      'Viaje enviado',
      `📍 Desde: ${puntoSeleccionado}\n📦 Objeto: ${objetoSeleccionado}\n👤 Para: ${destinatario}\n📬 Estación: ${estacionSeleccionada}`
    );

    // Limpiar campos
    setPuntoSeleccionado('');
    setDestinatario('');
    setObjetoSeleccionado(objetos[0]);
    setEstacionSeleccionada(estaciones[0]);
  };

  // Obtener ancho de pantalla para el mapa
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Enviar un viaje al Robot</Text>

      {/* MAPA */}
      <Text style={styles.label}>Selecciona tu ubicación en el mapa:</Text>
      <ImageBackground
        source={require('../assets/01.jpg')}
        style={{ width: screenWidth - 20, height: 300, marginBottom: 10 }}
      >
        {puntos.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: 30,
              height: 30,
              backgroundColor: puntoSeleccionado === p.nombre ? '#8b0000ff' : 'rgba(255,0,0,0.7)',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setPuntoSeleccionado(p.nombre)}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>📍</Text>
          </TouchableOpacity>
        ))}
      </ImageBackground>
      {puntoSeleccionado !== '' && (
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Ubicación seleccionada: {puntoSeleccionado}</Text>
      )}

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
