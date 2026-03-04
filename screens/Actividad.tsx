import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../styles/ActividadScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Viaje = {
  id: number;
  ubicacion: string;
  objeto: string;
  destinatario: string;
  estacion: string;
  fecha_creacion: string;
  fecha_formateada: string;
  estado: string;
};

const colorEstado = (estado: string) => {
  switch (estado) {
    case 'entregado':  return styles.entregado;
    case 'pendiente':  return styles.enCamino;
    case 'cancelado':  return styles.cancelado;
    default:           return {};
  }
};

const labelEstado = (estado: string) => {
  switch (estado) {
    case 'entregado': return 'Entregado';
    case 'pendiente': return 'En camino';
    case 'cancelado': return 'Cancelado';
    default:          return estado;
  }
};

export default function ActivityScreen() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [selectedViaje, setSelectedViaje] = useState<Viaje | null>(null);
  const [cargando, setCargando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarViajes = async (esRefresh = false) => {
    if (esRefresh) setRefreshing(true);
    else setCargando(true);
    setError(null);

    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) { setError('No se encontró sesión'); return; }
      const user = JSON.parse(userString);

      const resp = await fetch(`https://api.abelandres.dpdns.org/api/viajes/usuario/${user.id}`);
      const data = await resp.json();

      if (data.success) {
        setViajes(data.viajes);
      } else {
        setError('No se pudieron cargar los viajes');
      }
    } catch (e) {
      setError('Error de conexión');
      console.error(e);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  // Se recarga cada vez que el usuario entra a esta pestaña
  useFocusEffect(
    useCallback(() => {
      cargarViajes();
    }, [])
  );

  const renderItem = ({ item }: { item: Viaje }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.objeto}>{item.objeto}</Text>
        <Text style={[styles.estado, colorEstado(item.estado)]}>
          {labelEstado(item.estado)}
        </Text>
      </View>
      <Text style={styles.direccion}>{item.estacion}</Text>
      <Text style={styles.fecha}>{item.fecha_formateada ?? item.fecha_creacion}</Text>

      <TouchableOpacity style={styles.verMasBtn} onPress={() => setSelectedViaje(item)}>
        <Text style={styles.verMasText}>Ver más</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividad Reciente</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#cc0000', marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity onPress={() => cargarViajes()}>
            <Text style={{ color: '#007BFF' }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : viajes.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
          No tienes viajes registrados aún
        </Text>
      ) : (
        <FlatList
          data={viajes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => cargarViajes(true)} />
          }
        />
      )}

      <Modal
        visible={!!selectedViaje}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedViaje(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedViaje && (
              <>
                <Text style={styles.modalTitle}>{selectedViaje.objeto}</Text>
                <Text style={styles.modalText}>Ubicación origen: {selectedViaje.ubicacion}</Text>
                <Text style={styles.modalText}>Estación destino: {selectedViaje.estacion}</Text>
                <Text style={styles.modalText}>Fecha: {selectedViaje.fecha_formateada ?? selectedViaje.fecha_creacion}</Text>
                <Text style={styles.modalText}>Estado: {labelEstado(selectedViaje.estado)}</Text>
                <Text style={styles.modalText}>Destinatario ID: {selectedViaje.destinatario}</Text>

                <Pressable style={styles.cerrarBtn} onPress={() => setSelectedViaje(null)}>
                  <Text style={styles.cerrarBtnText}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}