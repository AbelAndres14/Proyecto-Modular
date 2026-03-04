import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/LoginScreen.styles';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SocketProvider } from './screens/SocketContext'; 

import HomeScreen from './screens/Home';
import ConfiguracionesScreen from './screens/Configuraciones';
import ActividadScreen from './screens/Actividad';
import PerfilScreen from './screens/Perfil';
import NotificacionesScreen from './screens/Notificaciones';
import PrivacidadScreen from './screens/Privacidad';
import RegistroScreen from './screens/Registro';
import LoginFormScreen from './screens/Login';
import ConfirmacionViaje from './screens/ConfirmacionViaje';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Inicio: undefined;
  LoginForm: undefined;
  MainTabs: undefined;
  Perfil: undefined;
  Registro: undefined;
  Notificaciones: undefined;
  Privacidad: undefined;
  ConfirmacionViaje: {
    punto: string;
    objeto: string;
    destinatario: string;
    estacion: string;
    remitente: string;
    fechaCreacion: string;
  };
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Configuraciones') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Actividad') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else {
            iconName = 'alert-circle';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Actividad" component={ActividadScreen} />
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Configuraciones" component={ConfiguracionesScreen} />
    </Tab.Navigator>
  );
}

function InicioScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Wally</Text>
      <Text style={styles.subtitle}>Controla tu robot con facilidad</Text>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate('LoginForm')}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={[styles.buttonText, styles.registerButtonText]}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>© 2025 RobotX Corp.</Text>
    </View>
  );
}

function AppNavigator() {
  return (
    // ✅ SocketProvider va DENTRO de NavigationContainer para poder usar useNavigation
    <SocketProvider>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="LoginForm" component={LoginFormScreen} />
        <Stack.Screen name="MainTabs" component={Tabs} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
        <Stack.Screen name="Privacidad" component={PrivacidadScreen} />
        <Stack.Screen name="ConfirmacionViaje" component={ConfirmacionViaje} />
      </Stack.Navigator>
    </SocketProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}