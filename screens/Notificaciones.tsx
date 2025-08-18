import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from '../styles/Notificaciones.styles';

const notificaciones = [
  {
    id: '1',
    titulo: 'Entrega realizada',
    descripcion: 'Tu paquete fue entregado correctamente por el robot.',
    fecha: 'Hoy, 9:30 AM',
  },
  {
    id: '2',
    titulo: 'Robot en camino',
    descripcion: 'El robot ya salió con tu pedido.',
    fecha: 'Ayer, 5:10 PM',
  },
  {
    id: '3',
    titulo: 'Actualización del sistema',
    descripcion: 'Se han mejorado las rutas del robot.',
    fecha: 'Lunes, 3:45 PM',
  },
];

export default function NotificacionesScreen() {
  const renderItem = ({ item }: { item: typeof notificaciones[0] }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
      <Text style={styles.fecha}>{item.fecha}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
