import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../styles/ActividadScreen.styles';

type Viaje = {
  id: string;
  objeto: string;
  direccion: string;
  fecha: string;
  estado: 'Entregado' | 'En camino' | 'Cancelado';
};

const viajes: Viaje[] = [
  {
    id: '1',
    objeto: 'Documento importante',
    direccion: 'Av. Reforma 123, CDMX',
    fecha: '24 Jul 2025 - 10:45 AM',
    estado: 'Entregado',
  },
  {
    id: '2',
    objeto: 'Comida',
    direccion: 'Calle Luna 456, Toluca',
    fecha: '23 Jul 2025 - 4:15 PM',
    estado: 'En camino',
  },
  {
    id: '3',
    objeto: 'Paquete mediano',
    direccion: 'Carr. Nacional 789, GDL',
    fecha: '22 Jul 2025 - 1:00 PM',
    estado: 'Cancelado',
  },
];

export default function ActivityScreen() {
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

      <TouchableOpacity style={styles.verMasBtn}>
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
    </View>
  );
}
