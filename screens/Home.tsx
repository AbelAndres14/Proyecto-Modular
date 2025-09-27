import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/HomeScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

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
            key={`${titulo}-${item}`}
            onPress={() => {
              setSeleccion(seleccion === item ? '' : item);
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
  destinatarioId: string;
  estacion: string;
  fechaCreacion: string;
}) => {
  try {
    const API_URL = 'https://apiabel.teamsystem.space/api/viajes';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const objetos = ['Paquete pequeño', 'Documento importante', 'otro'];
  const estaciones = ['Estación Norte', 'Estación Sur', 'Estación Este', 'Estación Oeste'];

  const [ubicacion, setUbicacion] = useState('');
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);

  // NUEVOS ESTADOS PARA DESTINATARIO CON ID
  const [destinatario, setDestinatario] = useState('');
  const [destinatarioId, setDestinatarioId] = useState<string>('');
  const [sugerencias, setSugerencias] = useState<{ id: string; nombre: string }[]>([]);

  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('');
  const [enviandoViaje, setEnviandoViaje] = useState(false);
  
  // Estado para guardar los datos del último viaje enviado
  const [ultimoViajeEnviado, setUltimoViajeEnviado] = useState<{
    punto: string;
    objeto: string;
    destinatario: string;
    estacion: string;
    fechaCreacion: string;
  } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const conectarSocket = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);

      socketRef.current = io('https://apiabel.teamsystem.space');

      socketRef.current.on('connect', () => {
        console.log('Conectado al servidor:', socketRef.current?.id);
        socketRef.current?.emit('registrarUsuario', user.id);
      });

      // Listener para recibir notificaciones de viajes
      socketRef.current.on('notificacion', (data) => {
        Alert.alert(
          data.titulo,
          data.mensaje,
          [
            {
              text: 'Ver detalles',
              onPress: () => {
                // Usar los datos reales del último viaje enviado si existen
                const datosParaNavegacion = ultimoViajeEnviado ? {
                  punto: ultimoViajeEnviado.punto,
                  objeto: ultimoViajeEnviado.objeto,
                  destinatario: ultimoViajeEnviado.destinatario,
                  estacion: ultimoViajeEnviado.estacion,
                  fechaCreacion: ultimoViajeEnviado.fechaCreacion,
                  remitente: 'Usuario remitente' // Este dato vendría idealmente del backend
                } : {
                  // Fallback con datos simulados si no hay datos guardados
                  punto: 'Ubicación recibida',
                  objeto: 'Paquete',
                  destinatario: 'Tu',
                  estacion: 'Estación asignada',
                  remitente: 'Usuario remitente',
                  fechaCreacion: new Date().toISOString()
                };
                
                console.log('Navegando a ConfirmacionViaje con datos:', datosParaNavegacion);
                navigation.navigate('ConfirmacionViaje', datosParaNavegacion);
              }
            },
            {
              text: 'Después',
              style: 'cancel'
            }
          ]
        );
      });
    };

    conectarSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const puntos = [
    { x: 50, y: 100, nombre: 'Módulo A' },
    { x: 150, y: 180, nombre: 'Módulo B' },
    { x: 250, y: 120, nombre: 'Auditorio' },
    { x: 350, y: 300, nombre: 'Biblioteca CID' },
    { x: 450, y: 220, nombre: 'Área de comida' },
  ];

  // MAPEAMOS LOS USUARIOS REGISTRADOS
  const usuariosRegistrados = [
    { id: '1', nombre: 'Usuario 1' },
    { id: '7', nombre: 'Pee Andrés' },
    { id: '5', nombre: 'Maria Lopez' },
    // Agrega todos tus usuarios aquí
  ];

  const obtenerIdUsuario = (nombre: string) => {
    const usuario = usuariosRegistrados.find(
      (u) => u.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
    );
    return usuario ? usuario.id : ''; // devuelve ID mapeado o vacío
  };

  const obtenerSugerencias = async (texto: string) => {
    setDestinatario(texto);

    if (texto.length < 2) {
      setSugerencias([]);
      setDestinatarioId('');
      return;
    }

    try {
      const resp = await fetch(`https://apiabel.teamsystem.space/api/users/suggest?q=${texto}`);
      const data = await resp.json();

      if (data.success && data.usuarios.length > 0) {
        // Mapeamos cada usuario con ID estático
        const sugerenciasConId = data.usuarios.map((u: { nombre: string }) => ({
          nombre: u.nombre,
          id: obtenerIdUsuario(u.nombre) || u.id || '', // si no existe, mantiene su ID original
        }));
        setSugerencias(sugerenciasConId);
      } else {
        setSugerencias([]);
        setDestinatarioId('');
      }
    } catch (err) {
      console.error(err);
      setSugerencias([]);
      setDestinatarioId('');
    }
  };

  const enviarViajeSimulado = async () => {
    try {
      const response = await fetch(
        "https://pretyphoid-unignoring-tisha.ngrok-free.dev/nuevo-viaje",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origen: 1,
            destino: 2,
          }),
        }
      );

      const data = await response.json();
      Alert.alert("Viaje simulado enviado", JSON.stringify(data));
    } catch (error) {
      Alert.alert("Error enviando viaje simulado", error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const enviarViaje = async () => {
    if (!puntoSeleccionado) {
      Alert.alert('Falta ubicación', 'Selecciona tu ubicación en el mapa');
      return;
    }
    
    if (!destinatario.trim()) {
      Alert.alert('Falta destinatario', 'Escribe el nombre del destinatario');
      return;
    }

    if (!estacionSeleccionada) {
      Alert.alert('Falta estación', 'Selecciona una estación');
      return;
    }
    setEnviandoViaje(true);

    const datosViaje = {
      ubicacion: puntoSeleccionado,
      objeto: objetoSeleccionado,
      destinatarioId: destinatarioId || obtenerIdUsuario(destinatario), // usa ID mapeado
      estacion: estacionSeleccionada,
      fechaCreacion: new Date().toISOString(),
    };

    console.log('Enviando datos:', datosViaje);

    const resultado = await enviarViajeABaseDatos(datosViaje);

    if (resultado.success) {
      // Guardar los datos del viaje enviado
      const datosViajeCompletos = {
        punto: puntoSeleccionado,
        objeto: objetoSeleccionado,
        destinatario: destinatario,
        estacion: estacionSeleccionada,
        fechaCreacion: datosViaje.fechaCreacion
      };
      setUltimoViajeEnviado(datosViajeCompletos);
      
      // Confirmación simple para el remitente, SIN navegación
      Alert.alert(
        'Viaje enviado exitosamente',
        `Tu viaje ha sido enviado a ${destinatario}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Solo limpiar campos, NO navegar
              setPuntoSeleccionado('');
              setDestinatario('');
              setDestinatarioId('');
              setObjetoSeleccionado(objetos[0]);
              setEstacionSeleccionada(estaciones[0]);
              setSugerencias([]);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('Error al enviar viaje', resultado.error);
    }
    setEnviandoViaje(false);
  };

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
        {puntos.map((p) => (
          <TouchableOpacity
            key={`punto-${p.nombre}`}
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

      {/* LISTA DE SUGERENCIAS */}
      {sugerencias.length > 0 && (
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
            elevation: 5,
            top: -25,
            overflow: 'hidden',
          }}
        >
          {sugerencias.map((item, index) => (
            <TouchableOpacity
              key={`sugerencia-${index}`}
              onPress={() => {
                setDestinatario(item.nombre);
                setDestinatarioId(item.id); // usa ID mapeado
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
              <Text style={{ fontSize: 15, color: '#000000ff' }}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ESTACIÓN */}
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

      {/* BOTÓN ENVIAR SIMULADO */}
      <TouchableOpacity
        style={[styles.pedirBtn, { backgroundColor: '#28a745', marginTop: 10 }]}
        onPress={enviarViajeSimulado}
      >
        <Text style={styles.pedirBtnText}>Probar Viaje Simulado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}