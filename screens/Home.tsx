import React, { useState, useEffect } from 'react';
import { styles } from '../styles/HomeScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useSocket } from './SocketContext'; // ✅ contexto global

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

type ViajeEnviado = {
  punto: string;
  objeto: string;
  destinatario: string;
  estacion: string;
  fechaCreacion: string;
};

const CuadrosOpciones = ({ data, seleccion, setSeleccion, titulo }: CuadrosOpcionesProps) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{titulo}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {data.map((item) => (
        <TouchableOpacity
          key={`${titulo}-${item}`}
          onPress={() => setSeleccion(seleccion === item ? '' : item)}
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
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const enviarViajeABaseDatos = async (datosViaje: {
  ubicacion: string;
  objeto: string;
  destinatarioId: string;
  estacion: string;
  fechaCreacion: string;
}) => {
  try {
    const response = await fetch('https://api.abelandres.dpdns.org/api/viajes', {
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
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ✅ Viaje recibido viene del contexto global — funciona en cualquier pantalla
  const { viajeRecibidoPendiente } = useSocket();

  const objetos = ['Paquete pequeño', 'Documento importante', 'otro'];
  const estaciones = ['Estacion 1', 'Estacion 2', 'Estacion 3', 'Estacion 4'];

  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [destinatario, setDestinatario] = useState('');
  const [destinatarioId, setDestinatarioId] = useState<string>('');
  const [sugerencias, setSugerencias] = useState<{ id: string; nombre: string }[]>([]);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('');
  const [enviandoViaje, setEnviandoViaje] = useState(false);
  const [ultimoViajeEnviado, setUltimoViajeEnviado] = useState<ViajeEnviado | null>(null);

  const puntos = [
    { x: 70, y: 80, nombre: 'Estacion 1' },
    { x: 90, y: 100, nombre: 'Estacion 2' },
    { x: 160, y: 10, nombre: 'Estacion 3' },
    { x: 180, y: 30, nombre: 'Estacion 4' },
  ];

  const obtenerSugerencias = async (texto: string) => {
    setDestinatario(texto);
    if (texto.length < 2) { setSugerencias([]); setDestinatarioId(''); return; }
    try {
      const resp = await fetch(`https://api.abelandres.dpdns.org/api/users/suggest?q=${texto}`);
      const data = await resp.json();
      if (data.success && data.usuarios.length > 0) {
        setSugerencias(data.usuarios.map((u: { nombre: string; id: string }) => ({ nombre: u.nombre, id: u.id })));
      } else { setSugerencias([]); setDestinatarioId(''); }
    } catch (err) { console.error(err); setSugerencias([]); setDestinatarioId(''); }
  };

  const enviarViaje = async () => {
    if (!puntoSeleccionado) { Alert.alert("Falta ubicación", "Selecciona tu ubicación en el mapa"); return; }
    if (!destinatario.trim()) { Alert.alert("Falta destinatario", "Escribe el nombre del destinatario"); return; }
    if (!estacionSeleccionada) { Alert.alert("Falta estación", "Selecciona una estación"); return; }

    setEnviandoViaje(true);
    const datosViaje = {
      ubicacion: puntoSeleccionado,
      objeto: objetoSeleccionado,
      destinatarioId,
      estacion: estacionSeleccionada,
      fechaCreacion: new Date().toISOString(),
    };
    const resultado = await enviarViajeABaseDatos(datosViaje);

    if (resultado.success) {
      setUltimoViajeEnviado({
        punto: puntoSeleccionado,
        objeto: objetoSeleccionado,
        destinatario,
        estacion: estacionSeleccionada,
        fechaCreacion: datosViaje.fechaCreacion,
      });
      setPuntoSeleccionado(""); setDestinatario(""); setDestinatarioId("");
      setObjetoSeleccionado(objetos[0]); setEstacionSeleccionada(estaciones[0]); setSugerencias([]);
      Alert.alert("Viaje enviado exitosamente", `Tu viaje ha sido enviado a ${destinatario}`);
    } else {
      Alert.alert("Error al enviar viaje", resultado.error);
    }
    setEnviandoViaje(false);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Enviar un viaje al Robot</Text>

        <Text style={styles.label}>Selecciona tu ubicación en el mapa:</Text>
        <ImageBackground
          source={require('../assets/02.png')}
          style={{ width: screenWidth - 20, height: 200, marginBottom: 10 }}
        >
          {puntos.map((p) => (
            <TouchableOpacity
              key={`punto-${p.nombre}`}
              style={{
                position: 'absolute', left: p.x, top: p.y,
                width: 30, height: 30,
                backgroundColor: puntoSeleccionado === p.nombre ? '#8b0000ff' : 'rgba(255,0,0,0.7)',
                borderRadius: 15, justifyContent: 'center', alignItems: 'center',
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

        <CuadrosOpciones data={objetos} seleccion={objetoSeleccionado} setSeleccion={setObjetoSeleccionado} titulo="¿Qué vas a mandar?" />

        <Text style={styles.label}>¿A quién se lo vas a mandar?</Text>
        <TextInput
          placeholder="Nombre del destinatario"
          placeholderTextColor="#7a7a7a"
          style={styles.input}
          value={destinatario}
          onChangeText={obtenerSugerencias}
        />

        {sugerencias.length > 0 && (
          <View style={{
            maxHeight: 180, marginBottom: -10, borderRadius: 10,
            backgroundColor: '#fff', borderWidth: 3, borderColor: '#ccc',
            shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, top: -25, overflow: 'hidden',
          }}>
            {sugerencias.map((item, index) => (
              <TouchableOpacity
                key={`sugerencia-${index}`}
                onPress={() => { setDestinatario(item.nombre); setDestinatarioId(item.id); setSugerencias([]); }}
                style={{
                  paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#2779fdff',
                  borderBottomWidth: index < sugerencias.length - 1 ? 1 : 0, borderBottomColor: '#eee',
                }}
                activeOpacity={0.6}
              >
                <Text style={{ fontSize: 15, color: '#000000ff' }}>{item.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <CuadrosOpciones data={estaciones} seleccion={estacionSeleccionada} setSeleccion={setEstacionSeleccionada} titulo="¿A dónde lo mandarás?" />

        <TouchableOpacity
          style={[styles.pedirBtn, { opacity: enviandoViaje ? 0.6 : 1 }]}
          onPress={enviarViaje}
          disabled={enviandoViaje}
        >
          <Text style={styles.pedirBtnText}>{enviandoViaje ? 'Enviando...' : 'Enviar Viaje'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ ÍCONO NARANJA — Viaje recibido (del contexto global, persiste en cualquier pantalla) */}
      {viajeRecibidoPendiente && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: ultimoViajeEnviado ? 90 : 30,
            right: 20,
            backgroundColor: '#e67e00',
            padding: 12,
            borderRadius: 25,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('ConfirmacionViaje', viajeRecibidoPendiente)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>📬 Viaje recibido</Text>
        </TouchableOpacity>
      )}

      {/* ÍCONO AZUL — Último viaje que YO envié */}
      {ultimoViajeEnviado && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 30,
            right: 20,
            backgroundColor: '#007BFF',
            padding: 12,
            borderRadius: 25,
            zIndex: 10,
          }}
          onPress={() => navigation.navigate('ConfirmacionViaje', {
            ...ultimoViajeEnviado,
            remitente: 'Usuario remitente',
          })}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>📄 Último Viaje</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}