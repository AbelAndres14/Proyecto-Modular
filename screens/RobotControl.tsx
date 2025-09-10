import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar el cliente MQTT
// Nota: react-native-mqtt puede necesitar configuración adicional
// Alternativamente, puedes usar una librería web como 'mqtt' con WebSockets

interface RobotState {
  estacion: number;
  estado: string;
  timestamp: string;
}

interface Viaje {
  estacionDestino: number;
  id: string;
}

const RobotControlScreen = () => {
  // Estados del robot
  const [robotState, setRobotState] = useState<RobotState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [colaViajes, setColaViajes] = useState<Viaje[]>([]);
  const [viajeActual, setViajeActual] = useState<Viaje | null>(null);
  const [nuevaEstacion, setNuevaEstacion] = useState('');
  const [historialComandos, setHistorialComandos] = useState<string[]>([]);

  // Simulación de cliente MQTT (reemplazar con implementación real)
  const [mqttClient, setMqttClient] = useState<any>(null);

  useEffect(() => {
    // Aquí conectarías al broker MQTT real
    conectarMQTT();
    
    // Cleanup
    return () => {
      if (mqttClient) {
        mqttClient.disconnect();
      }
    };
  }, []);

  const conectarMQTT = async () => {
    try {
      // Simulación - reemplazar con cliente MQTT real
      console.log('Conectando a MQTT broker...');
      
      // Configuración del cliente MQTT
      /*
      const client = mqtt.connect('mqtt://broker.emqx.io', {
        clientId: `robot_control_${Math.random().toString(16).substr(2, 8)}`,
        port: 1883,
      });

      client.on('connect', () => {
        console.log('✅ Conectado al broker MQTT');
        setIsConnected(true);
        client.subscribe('robot1/estado');
      });

      client.on('message', (topic, message) => {
        if (topic === 'robot1/estado') {
          const data = JSON.parse(message.toString());
          setRobotState(data);
        }
      });

      setMqttClient(client);
      */
      
      // Simulación temporal
      setIsConnected(true);
      
      // Simular estado inicial del robot
      setRobotState({
        estacion: 1,
        estado: 'IDLE',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error conectando MQTT:', error);
      Alert.alert('Error', 'No se pudo conectar al robot');
    }
  };

  const enviarComando = (comando: string) => {
    if (!isConnected || !mqttClient) {
      Alert.alert('Error', 'No hay conexión con el robot');
      return;
    }

    try {
      // Enviar comando real al robot
      mqttClient.publish('robot1/comando', comando, (err: any) => {
        if (err) {
          console.error('Error enviando comando:', err);
          Alert.alert('Error', 'No se pudo enviar el comando');
          return;
        }
        
        console.log(`➡️ Comando enviado: ${comando}`);
        
        // Agregar al historial
        const nuevoComando = `${new Date().toLocaleTimeString()} - ${comando}`;
        setHistorialComandos(prev => [nuevoComando, ...prev.slice(0, 9)]);
      });
      
    } catch (error) {
      console.error('Error enviando comando:', error);
      Alert.alert('Error', 'No se pudo enviar el comando');
    }
  };

  const agregarViaje = () => {
    const estacion = parseInt(nuevaEstacion);
    if (isNaN(estacion) || estacion < 1) {
      Alert.alert('Error', 'Ingresa un número de estación válido');
      return;
    }

    const nuevoViaje: Viaje = {
      estacionDestino: estacion,
      id: Math.random().toString()
    };

    setColaViajes(prev => [...prev, nuevoViaje]);
    setNuevaEstacion('');
    
    Alert.alert('Éxito', `Viaje a estación ${estacion} agregado a la cola`);
  };

  const iniciarViaje = (viaje: Viaje) => {
    setViajeActual(viaje);
    setColaViajes(prev => prev.filter(v => v.id !== viaje.id));
    
    // Lógica para decidir comando inicial
    if (robotState) {
      if (robotState.estacion < viaje.estacionDestino) {
        enviarComando('FORWARD');
      } else if (robotState.estacion > viaje.estacionDestino) {
        enviarComando('UTURN');
      }
    }
  };

  const cancelarViaje = () => {
    setViajeActual(null);
    enviarComando('STOP');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Estado de conexión */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Conectado al Robot' : 'Desconectado'}
        </Text>
      </View>

      {/* Estado actual del robot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado del Robot</Text>
        {robotState ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>📍 Estación: {robotState.estacion}</Text>
            <Text style={styles.stateText}>⚡ Estado: {robotState.estado}</Text>
            <Text style={styles.stateText}>🕐 Actualizado: {new Date(robotState.timestamp).toLocaleTimeString()}</Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>No hay datos del robot</Text>
        )}
      </View>

      {/* Viaje actual */}
      {viajeActual && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viaje Actual</Text>
          <View style={styles.currentTripContainer}>
            <Text style={styles.tripText}>🎯 Destino: Estación {viajeActual.estacionDestino}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelarViaje}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Controles manuales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control Manual</Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.forwardButton]}
            onPress={() => enviarComando('FORWARD')}
            disabled={!isConnected}
          >
            <Ionicons name="arrow-up" size={24} color="white" />
            <Text style={styles.controlButtonText}>AVANZAR</Text>
          </TouchableOpacity>
          
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.controlButton, styles.uturnButton]}
              onPress={() => enviarComando('UTURN')}
              disabled={!isConnected}
            >
              <Ionicons name="return-up-back" size={24} color="white" />
              <Text style={styles.controlButtonText}>U-TURN</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={() => enviarComando('STOP')}
              disabled={!isConnected}
            >
              <Ionicons name="stop" size={24} color="white" />
              <Text style={styles.controlButtonText}>PARAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Agregar viaje */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programar Viaje</Text>
        <View style={styles.addTripContainer}>
          <TextInput
            style={styles.stationInput}
            placeholder="Número de estación"
            value={nuevaEstacion}
            onChangeText={setNuevaEstacion}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={agregarViaje}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cola de viajes */}
      {colaViajes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cola de Viajes</Text>
          {colaViajes.map((viaje, index) => (
            <View key={viaje.id} style={styles.tripItem}>
              <Text style={styles.tripText}>
                {index + 1}. Estación {viaje.estacionDestino}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => iniciarViaje(viaje)}
              >
                <Text style={styles.startButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Historial de comandos */}
      {historialComandos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Comandos</Text>
          {historialComandos.map((comando, index) => (
            <Text key={index} style={styles.historyItem}>{comando}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  stateContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  stateText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  currentTripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
  },
  tripText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    marginBottom: 8,
  },
  forwardButton: {
    backgroundColor: '#4CAF50',
  },
  uturnButton: {
    backgroundColor: '#FF9800',
    marginRight: 8,
  },
  stopButton: {
    backgroundColor: '#f44336',
    marginLeft: 8,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addTripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  historyItem: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
});

export default RobotControlScreen;