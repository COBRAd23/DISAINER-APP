import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import OnboardingScreen from './src/screens/OnboardingScreen';
import TabNavigator from './src/navigation/TabNavigator';
import SplashScreenComponent from './src/screens/SplashScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';

// Prevenimos el auto-hide del splash
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

// Global mock for demo purposes
export let setDemoUserGlobal;

function App() {
  const [user, setUser] = useState(null);
  const [demoUser, setDemoUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  setDemoUserGlobal = setDemoUser;

  // Carga de fuentes originales
  let [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Montserrat_700Bold,
  });

  // Listener de Firebase
  useEffect(() => {
    let subscriber;
    try {
      subscriber = onAuthStateChanged(
        auth, 
        (firebaseUser) => {
          setUser(firebaseUser);
          setInitializing(false);
        },
        (error) => {
          // Firebase Auth error (ej: API key inválida) — no bloquea la app
          console.warn('Firebase Auth error:', error.code);
          setInitializing(false);
        }
      );
    } catch(e) {
      console.warn('Firebase init warning:', e.message);
      setInitializing(false);
    }
    return subscriber;
  }, []);

  // Ocultamos el splash cuando las fuentes estén listas
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!isAppReady) {
    return <SplashScreenComponent onFinish={() => setIsAppReady(true)} />;
  }

  const activeUser = user || demoUser;

  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {activeUser ? (
                <>
                  <Stack.Screen name="Main" component={TabNavigator} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Projects" component={ProjectsScreen} />
                  <Stack.Screen name="Messages" component={MessagesScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Signup" component={SignupScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

registerRootComponent(App);
