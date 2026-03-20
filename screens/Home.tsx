import React, { useState, useEffect } from 'react';
import { styles } from '../styles/HomeScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useSocket } from './SocketContext'; // ✅ contexto global
import DropDownPicker from 'react-native-dropdown-picker';
import Svg, { Line, Circle } from 'react-native-svg';

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
  remitenteId: string;
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

    const data = await response.json();
    const idViaje = data.viaje.id;

    fetch(`https://332e-216-74-107-5.ngrok-free.app/ir?envio=${datosViaje.ubicacion}&entrega=${datosViaje.estacion}&id=${idViaje}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    //const resultado = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // ✅ Viaje recibido viene del contexto global — funciona en cualquier pantalla
  const { viajeRecibidoPendiente } = useSocket();

  const objetos = ['Paquete', 'Documento'];
  const estaciones = [ 'puntoA', 'puntoB', 'puntoC', 'puntoD', 'puntoE', 'puntoF', 'puntoG', 'puntoH', 'puntoI', 'puntoJ', 'puntoK', 'puntoL', 'puntoM', 'puntoN', 'puntoO', 'puntoP', 'puntoQ', 'puntoR', 'puntoS', 'puntoT', 'puntoU', 'puntoV', 'puntoV2', 'puntoX', 'puntoZ', 'puntoZ1', 'puntoZ2' ];
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(objetos[0]);
  const [destinatario, setDestinatario] = useState('');
  const [destinatarioId, setDestinatarioId] = useState<string>('');
  const [sugerencias, setSugerencias] = useState<{ id: string; nombre: string }[]>([]);  
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(estaciones[0]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('');
  const [enviandoViaje, setEnviandoViaje] = useState(false);

  const [open, setOpen] = useState(false); 
  const [open2, setOpen2] = useState(false); 
  const [value, setValue] = useState(estaciones[0]); 
  const [value2, setValue2] = useState(estaciones[0]); 
  const [items, setItems] = useState( estaciones.map((e) => ({ label: e, value: e })) );
  const [ultimoViajeEnviado, setUltimoViajeEnviado] = useState<ViajeEnviado | null>(null);

  const [puntos,setPuntos] = useState([
    { x: 125, y: 43, nombre: 'puntoX' },
    { x: 125, y: 65, nombre: 'puntoW' },
    { x: 193, y: 43, nombre: 'puntoV' },
    { x: 193, y: 65, nombre: 'puntoV2' },
    { x: 265, y: 73, nombre: 'puntoU' },
    { x: 265, y: 95, nombre: 'puntoT' },
    { x: 190, y: 117, nombre: 'puntoS' },
    { x: 188, y: 160, nombre: 'puntoO' },
    { x: 248, y: 117, nombre: 'puntoR' },
    { x: 310, y: 125, nombre: 'puntoQ' },
    { x: 265, y: 150, nombre: 'puntoP' },
    { x: 190, y: 190, nombre: 'puntoN' },
    { x: 190, y: 220, nombre: 'puntoM' },
    { x: 280, y: 215, nombre: 'puntoL' },
    { x: 190, y: 240, nombre: 'puntoK' },
    { x: 207, y: 248, nombre: 'puntoJ' },
    { x: 176, y: 273, nombre: 'puntoH' },
    { x: 207, y: 280, nombre: 'puntoF' },
    { x: 240, y: 273, nombre: 'puntoI' },
    { x: 103, y: 272, nombre: 'puntoG' },
    { x: 207, y: 315, nombre: 'puntoE' },
    { x: 278, y: 240, nombre: 'puntoAlfaBeta' },
    { x: 303, y: 95, nombre: 'puntoInteligente' },
    { x: 230, y: 355, nombre: 'puntoBiblioteca' },
    { x: 250, y: 398, nombre: 'puntoD' },
    { x: 255, y: 425, nombre: 'puntoC' },
    { x: 260, y: 445, nombre: 'puntoB' },
    { x: 225, y: 420, nombre: 'puntoA' },
    { x: 115, y: 118, nombre: 'puntoY' },
    { x: 85, y: 130, nombre: 'puntoZ' },
    { x: 60, y: 93, nombre: 'puntoZ1' },
    { x: 50, y: 135, nombre: 'puntoZ2' },
    //Conexiones
    { x: 230, y: 385, nombre: 'conexionA_Biblioteca' },
    { x: 240, y: 429, nombre: 'conexionA_B' },
    { x: 250, y: 215, nombre: 'conexionPasillo_N_L' },
    { x: 240, y: 220, nombre: 'conexion_pasillo_alfa_beta' },
    { x: 160, y: 240, nombre: 'conexionPasillo_K' },
    { x: 160, y: 217, nombre: 'conexionPasillo_M' },
    { x: 160, y: 190, nombre: 'conexionPasillo_N' },
    { x: 160, y: 160, nombre: 'conexionPasillo_O' },
    { x: 225, y: 160, nombre: 'conexionPasillo_O_P_N' },
    { x: 160, y: 120, nombre: 'conexionPasillo_S' },
    { x: 225, y: 117, nombre: 'conexionPasillo_S_R' },
    { x: 225, y: 190, nombre: 'conexionPasillo_N_P' },
    { x: 250, y: 237, nombre: 'conexionPasillo_Alfa_Beta' },
    { x: 303, y: 73, nombre: 'conexionPasillo_U' },
    { x: 232, y: 43, nombre: 'conexionPasillo_V_U' },
    { x: 230, y: 95, nombre: 'conexionPasillo_V2_T' },
    { x: 158, y: 65, nombre: 'conexionPasillo_W_V2' },
    { x: 158, y: 43, nombre: 'conexionPasillo_X_V' },
    { x: 145, y: 120, nombre: 'conexionPasillo_Y' },
    { x: 90, y: 110, nombre: 'conexionPasillo_Z' },
    { x: 270, y: 130, nombre: 'conexionPasillo_R_Q' },
    { x: 80, y: 95, nombre: 'conexionPasillo_Z1_Z2' },
  ]);

  const [ruta, setRuta] = useState([]);
  const [robotPos, setRobotPos] = useState({ x: 70, y: 80 });
  const { socket } = useSocket();

  useEffect(() => {

  if (!socket) return;

  const handleRuta = (data) => {


    if (data.ruta) {

      const rutaConvertida = data.ruta
        .map(n => puntos.find(p => p.nombre === n.nodo))
        .filter(Boolean);

      setRuta(rutaConvertida);
    }

    if (data.robot?.nombre) {

      const nodoRobot = puntos.find(
        p => p.nombre === data.robot.nombre
      );

      if (nodoRobot) {
        setRobotPos({
          x: nodoRobot.x,
          y: nodoRobot.y
        });
      }

    }

  };

  const handleMovimiento = (data) => {

    const nodoActual = puntos.find(
      n => n.nombre === data.nodoActual
    );

    const nodoDestino = puntos.find(
      n => n.nombre === data.nodoDestino
    );

    if (!nodoActual || !nodoDestino) return;

    const x =
      nodoActual.x +
      (nodoDestino.x - nodoActual.x) * data.progreso;

    const y =
      nodoActual.y +
      (nodoDestino.y - nodoActual.y) * data.progreso;

    setRobotPos({ x, y });

  };

  socket.on("robotRuta", handleRuta);
  socket.on("robotPosicion", handleMovimiento);

  return () => {
    socket.off("robotRuta", handleRuta);
    socket.off("robotPosicion", handleMovimiento);
  };

}, [socket, ruta]);

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
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const datosViaje = {
      ubicacion: puntoSeleccionado,
      objeto: objetoSeleccionado,
      destinatarioId,
      remitenteId: String(user?.id ?? ''), // ✅ quién envía
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

        <ImageBackground
          source={require('../assets/03.jpeg')}
          style={{ width: screenWidth - 20, height: 450, marginBottom: 10 }}
        >

          {/* LINEAS DEL GRAFO */}
          <Svg
            height="450"
            width={screenWidth - 20}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {ruta.length > 1 &&
              ruta.map((nodo, i) => {
                if (i === ruta.length - 1) return null;

                const siguiente = ruta[i + 1];

                return (
                  <Line
                    key={`linea-${i}`}
                    x1={nodo.x}
                    y1={nodo.y}
                    x2={siguiente.x}
                    y2={siguiente.y}
                    stroke="black"
                    strokeWidth="4"
                  />
                );
              })}

            {ruta.length > 0 && (
              <Circle
                cx={robotPos.x}
                cy={robotPos.y}
                r="8"
                fill="blue"
              />
            )}
          </Svg>

          {/* PUNTOS DEL MAPA */}
          {puntos.map((p) => (
            <TouchableOpacity
              key={`punto-${p.nombre}`}
              style={{
                position: 'absolute',
                left: p.x - 8,
                top: p.y - 8,
                width: 10,
                height: 10,
                borderRadius: 8,
                backgroundColor: puntoSeleccionado === p.nombre ? '#8b0000' : '#ff4444',
                borderWidth: 1,
                borderColor: '#fff',
              }}
              onPress={() => setPuntoSeleccionado(p.nombre)}
            />
          ))}

        </ImageBackground>

        <View style={{ zIndex: 3000, marginBottom: 20 }}>
          <DropDownPicker
            open={open2}
            value={value2}
            items={items}
            setOpen={setOpen2}
            setValue={setValue2}
            setItems={setItems}
            placeholder="Selecciona una estación"
            listMode="MODAL"
            modalTitle="Selecciona una estación"
            modalAnimationType="slide"

            // INPUT CERRADO
            style={{
              backgroundColor: '#007BFF55',
              borderColor: '#ffffff',
              borderWidth: 2,
              borderRadius: 10,
              height: 50,
              paddingHorizontal: 15,
            }}

            textStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 14,
            }}

            placeholderStyle={{
              color: '#ffffffaa',
              fontWeight: 'bold',
            }}

            // MODAL COMPLETO
            modalContentContainerStyle={{
              backgroundColor: '#003f88', // azul corporativo oscuro
            }}

            modalTitleStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 16,
            }}

            // ITEMS
            listItemContainerStyle={{
              backgroundColor: '#003f88',
            }}

            listItemLabelStyle={{
              color: '#ffffff',
              fontSize: 14,
            }}

            // ITEM SELECCIONADO
            selectedItemContainerStyle={{
              backgroundColor: '#8b0000ff',
            }}

            selectedItemLabelStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
            }}

            onChangeValue={(val) => {
              if (val) {
                setValue2(val);
                setPuntoSeleccionado(val);
              }
            }}
          />
        </View>

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

        <View style={{ zIndex: 3000, marginBottom: 20 }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Selecciona una estación"
            listMode="MODAL"
            modalTitle="Selecciona una estación"
            modalAnimationType="slide"

            // INPUT CERRADO
            style={{
              backgroundColor: '#007BFF55',
              borderColor: '#ffffff',
              borderWidth: 2,
              borderRadius: 10,
              height: 50,
              paddingHorizontal: 15,
            }}

            textStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 14,
            }}

            placeholderStyle={{
              color: '#ffffffaa',
              fontWeight: 'bold',
            }}

            // MODAL COMPLETO
            modalContentContainerStyle={{
              backgroundColor: '#003f88', // azul corporativo oscuro
            }}

            modalTitleStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 16,
            }}

            // ITEMS
            listItemContainerStyle={{
              backgroundColor: '#003f88',
            }}

            listItemLabelStyle={{
              color: '#ffffff',
              fontSize: 14,
            }}

            // ITEM SELECCIONADO
            selectedItemContainerStyle={{
              backgroundColor: '#8b0000ff',
            }}

            selectedItemLabelStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
            }}

            onChangeValue={(val) => {
              if (val) {
                setValue(val);
                setEstacionSeleccionada(val);
              }
            }}
          />
        </View>
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