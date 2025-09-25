import React, { useState, useEffect } from 'react';
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
  FlatList,
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
                setSeleccion('');
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

// Función para enviar datos a la base de datos
const enviarViajeABaseDatos = async (datosViaje: {
  ubicacion: string;
  objeto: string;
  destinatario: string;
  estacion: string;
  fechaCreacion: string;
}) => {
  try {
    console.log('Enviando datos:', datosViaje);
    const API_URL = 'https://apiabel.teamsystem.space/api/viajes';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosViaje),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const resultado = await response.json();
    return { success: true, data: resultado };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export default function Home() {
  const objetos = ['Paquete pequeño', 'Documento importante', 'otro'];
  const estaciones = ['Estación Norte', 'Estación Sur', 'Estación Este', 'Estación Oeste'];

  const [ubicacion, setUbicacion] = useState('');
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [destinatario, setDestinatario] = useState('');
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('');
  const [enviandoViaje, setEnviandoViaje] = useState(false);

  // Puntos de interés en el mapa
  const puntos = [
    { x: 50, y: 100, nombre: 'Módulo A' },
    { x: 150, y: 180, nombre: 'Módulo B' },
    { x: 250, y: 120, nombre: 'Auditorio' },
    { x: 350, y: 300, nombre: 'Biblioteca CID' },
    { x: 450, y: 220, nombre: 'Área de comida' },
  ];

  const obtenerSugerencias = async (texto: string) => {
    setDestinatario(texto);
    if (texto.length < 2) {
      setSugerencias([]);
      return;
    }
    try {
      const resp = await fetch(`https://apiabel.teamsystem.space/api/users/suggest?q=${texto}`);
      const data = await resp.json();
      if (data.success) {
        setSugerencias(data.nombres);
      } else {
        setSugerencias([]);
      }
    } catch (err) {
      console.error(err);
      setSugerencias([]);
    }
  };

  const enviarViaje = async () => {
    if (!puntoSeleccionado || !destinatario.trim() || !estacionSeleccionada) {
      Alert.alert('Faltan datos', 'Por favor, completa todos los campos.');
      return;
    }

    setEnviandoViaje(true);

    const datosViaje = {
      ubicacion: puntoSeleccionado,
      objeto: objetoSeleccionado,
      destinatario: destinatario.trim(),
      estacion: estacionSeleccionada,
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
    };

    const resultado = await enviarViajeABaseDatos(datosViaje);

    if (resultado.success) {
      Alert.alert(
        '✅ Viaje enviado exitosamente',
        `📍 Desde: ${puntoSeleccionado}\n📦 Objeto: ${objetoSeleccionado}\n👤 Para: ${destinatario}\n📬 Estación: ${estacionSeleccionada}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setPuntoSeleccionado('');
              setDestinatario('');
              setObjetoSeleccionado(objetos[0]);
              setEstacionSeleccionada(estaciones[0]);
              setSugerencias([]);
            }
          }
        ]
      );
    } else {
      Alert.alert('❌ Error al enviar viaje', resultado.error);
    }

    setEnviandoViaje(false);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView
  contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
>
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
          backgroundColor:
            puntoSeleccionado === p.nombre ? '#8b0000ff' : 'rgba(255,0,0,0.7)',
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
    <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
      Ubicación seleccionada: {puntoSeleccionado}
    </Text>
  )}

  {/* OPCIONES */}
  <CuadrosOpciones
    data={objetos}
    seleccion={objetoSeleccionado}
    setSeleccion={setObjetoSeleccionado}
    titulo="¿Qué vas a mandar?"
  />

  {/* DESTINATARIO */}
  <Text style={styles.label}>¿A quién se lo vas a mandar?</Text>
  <TextInput
    placeholder="Nombre del destinatario"
    placeholderTextColor="#7a7a7a"
    style={styles.input}
    value={destinatario}
    onChangeText={obtenerSugerencias}
  />

  {/* LISTA DE SUGERENCIAS corregida */}
  { sugerencias.length > 0 && (
  <View
    style={{
      maxHeight: 180,
      marginBottom: -10,
      borderRadius: 10,
      backgroundColor: '#fff',
      borderWidth: 3,
      borderColor: '#ccc',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // sombra Android
      top: -25,
      overflow: 'hidden',
    }}
  >
    {sugerencias.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setDestinatario(item);
          setSugerencias([]);
        }}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 30,
          backgroundColor: '#2779fdff',
          borderBottomWidth: index < sugerencias.length - 1 ? 1 : 0,
          borderBottomColor: '#eee',
        }}
        activeOpacity={0.6}
      >
        <Text style={{ fontSize: 15, color: '#000000ff' }}>{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

  <CuadrosOpciones
    data={estaciones}
    seleccion={estacionSeleccionada}
    setSeleccion={setEstacionSeleccionada}
    titulo="¿A dónde lo mandarás?"
  />

  {/* BOTÓN ENVIAR */}
  <TouchableOpacity
    style={[styles.pedirBtn, { opacity: enviandoViaje ? 0.6 : 1 }]}
    onPress={enviarViaje}
    disabled={enviandoViaje}
  >
    <Text style={styles.pedirBtnText}>
      {enviandoViaje ? 'Enviando...' : 'Enviar Viaje'}
    </Text>
  </TouchableOpacity>
</ScrollView>

  );
}