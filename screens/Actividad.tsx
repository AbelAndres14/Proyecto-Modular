import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { styles } from '../styles/ActividadScreen.styles';

type Viaje = {
  id: string;
  objeto: string;
  direccion: string;
  fecha: string;
  estado: 'Entregado' | 'En camino' | 'Cancelado' | 'Error';
  remitente: string;
  duracion: string;
  robot: string;
  observaciones: string;
};

const viajes: Viaje[] = [
  {
    id: '1',
    objeto: 'Documento importante',
    direccion: 'Av. Reforma 123, CDMX',
    fecha: '24 Jul 2025 - 10:45 AM',
    estado: 'Entregado',
    remitente: 'Oficina Legal CDMX',
    duracion: '35 minutos',
    robot: 'RobotX-01',
    observaciones: 'Entregado sin inconvenientes',
  },
  {
    id: '2',
    objeto: 'Comida',
    direccion: 'Calle Luna 456, Toluca',
    fecha: '23 Jul 2025 - 4:15 PM',
    estado: 'En camino',
    remitente: 'Restaurante Luna',
    duracion: '—',
    robot: 'RobotX-03',
    observaciones: 'Robot en camino, sin retrasos',
  },
  {
    id: '3',
    objeto: 'Paquete mediano',
    direccion: 'Carr. Nacional 789, GDL',
    fecha: '22 Jul 2025 - 1:00 PM',
    estado: 'Cancelado',
    remitente: 'Centro de Distribución GDL',
    duracion: '—',
    robot: 'RobotX-05',
    observaciones: 'Cancelado por condiciones climáticas',
  },
];

export default function ActivityScreen() {
  const [selectedViaje, setSelectedViaje] = useState<Viaje | null>(null);

  const renderItem = ({ item }: { item: Viaje }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.objeto}>{item.objeto}</Text>
        <Text
          style={[
            styles.estado,
            item.estado === 'Entregado' && styles.entregado,
            item.estado === 'En camino' && styles.enCamino,
            item.estado === 'Cancelado' && styles.cancelado,
          ]}
        >
          {item.estado}
        </Text>
      </View>
      <Text style={styles.direccion}>{item.direccion}</Text>
      <Text style={styles.fecha}>{item.fecha}</Text>

      <TouchableOpacity style={styles.verMasBtn} onPress={() => setSelectedViaje(item)}>
        <Text style={styles.verMasText}>Ver más</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividad Reciente</Text>
      <FlatList
        data={viajes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />

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
                <Text style={styles.modalText}>Dirección: {selectedViaje.direccion}</Text>
                <Text style={styles.modalText}>Fecha: {selectedViaje.fecha}</Text>
                <Text style={styles.modalText}>Remitente: {selectedViaje.remitente}</Text>
                <Text style={styles.modalText}>Duración: {selectedViaje.duracion}</Text>
                <Text style={styles.modalText}>Robot asignado: {selectedViaje.robot}</Text>
                <Text style={styles.modalText}>Observaciones: {selectedViaje.observaciones}</Text>

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
