import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ConfirmacionViaje() {
  const route = useRoute();
  const { punto, objeto, destinatario, estacion } = route.params as {
    punto: string;
    objeto: string;
    destinatario: string;
    estacion: string;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ubicación: {punto}</Text>
      <Text>Objeto: {objeto}</Text>
      <Text>Destinatario: {destinatario}</Text>
      <Text>Estación: {estacion}</Text>
    </View>
  );
}
