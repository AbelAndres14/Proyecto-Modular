import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const STORAGE_KEY_RECIBIDO = 'viajeRecibidoPendiente';

type ViajeRecibido = {
  punto: string;
  objeto: string;
  destinatario: string;
  estacion: string;
  remitente: string;
  fechaCreacion: string;
};

type SocketContextType = {
  viajeRecibidoPendiente: ViajeRecibido | null;
  limpiarViajePendiente: () => void;
};

const SocketContext = createContext<SocketContextType>({
  viajeRecibidoPendiente: null,
  limpiarViajePendiente: () => {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const socketRef = useRef<Socket | null>(null);
  const [viajeRecibidoPendiente, setViajeRecibidoPendiente] = useState<ViajeRecibido | null>(null);

  // Cargar viaje pendiente al iniciar
  useEffect(() => {
    const cargarViajePendiente = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEY_RECIBIDO);
        if (guardado) setViajeRecibidoPendiente(JSON.parse(guardado));
      } catch (e) {
        console.error('Error cargando viaje pendiente:', e);
      }
    };
    cargarViajePendiente();
  }, []);

  // Conectar socket una sola vez para toda la app
  useEffect(() => {
    const conectar = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);

      socketRef.current = io('https://api.abelandres.dpdns.org');

      socketRef.current.on('connect', () => {
        console.log('Socket global conectado:', socketRef.current?.id);
        socketRef.current?.emit('registrarUsuario', user.id);
      });

      socketRef.current.on('notificacion', async (data) => {
        const nuevoViaje: ViajeRecibido = {
          punto: data.ubicacion ?? 'Ubicación recibida',
          objeto: data.objeto ?? 'Paquete',
          destinatario: data.destinatario ?? 'Tú',
          estacion: data.estacion ?? 'Estación asignada',
          remitente: data.remitente ?? 'Usuario remitente',
          fechaCreacion: data.fechaCreacion ?? new Date().toISOString(),
        };

        // Guardar en AsyncStorage antes de mostrar alerta
        try {
          await AsyncStorage.setItem(STORAGE_KEY_RECIBIDO, JSON.stringify(nuevoViaje));
        } catch (e) {
          console.error('Error guardando viaje:', e);
        }
        setViajeRecibidoPendiente(nuevoViaje);

        // ✅ Notifica sin importar en qué pantalla esté el usuario
        Alert.alert(
          data.titulo,
          data.mensaje,
          [
            {
              text: 'Ver detalles',
              onPress: () => {
                navigation.navigate('ConfirmacionViaje', nuevoViaje);
              },
            },
            {
              text: 'Después',
              style: 'cancel',
              // No limpia nada — el ícono persiste
            },
          ]
        );
      });
    };

    conectar();
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const limpiarViajePendiente = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_RECIBIDO);
    setViajeRecibidoPendiente(null);
  };

  return (
    <SocketContext.Provider value={{ viajeRecibidoPendiente, limpiarViajePendiente }}>
      {children}
    </SocketContext.Provider>
  );
}