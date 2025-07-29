import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/LoginScreen.styles';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/Home';
import ConfiguracionesScreen from './screens/Configuraciones';
import ActividadScreen from './screens/Actividad';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//me ayudaron con git
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
        onPress={() => alert('Funcionalidad de registro próximamente')}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
