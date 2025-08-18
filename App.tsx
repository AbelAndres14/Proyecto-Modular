import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './styles/LoginScreen.styles';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Pantallas principales
import HomeScreen from './screens/Home';
import ConfiguracionesScreen from './screens/Configuraciones';
import ActividadScreen from './screens/Actividad';
import PerfilScreen from './screens/Perfil';
import NotificacionesScreen from './screens/Notificaciones';
import PrivacidadScreen from './screens/Privacidad';
import Registro from './screens/Registro';

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();

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

interface Props {
  navigation: any;
}

function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Wally</Text>
      <Text style={styles.subtitle}>Controla tu robot con facilidad </Text>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.replace('MainTabs')}
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={Tabs} />

        {/* 👉 Aquí agregas las nuevas pantallas */}
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
        <Stack.Screen name="Privacidad" component={PrivacidadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
