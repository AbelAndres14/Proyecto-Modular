import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from '../styles/Privacidad.styles';

export default function PrivacidadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Privacidad</Text>

      <View style={styles.seccion}>
        <Text style={styles.titulo}>Control de datos</Text>
        <Text style={styles.descripcion}>
          Tus datos están seguros. Puedes gestionar qué tipo de información compartes
          con la app, incluyendo ubicación, historial de actividad y preferencias.
        </Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.titulo}>Ubicación</Text>
        <Text style={styles.descripcion}>
          Solo se accede a tu ubicación mientras usas la app para garantizar una entrega precisa.
        </Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.titulo}>Historial</Text>
        <Text style={styles.descripcion}>
          Puedes borrar tu historial de entregas en cualquier momento desde la configuración.
        </Text>
      </View>
    </SafeAreaView>
  );
}
