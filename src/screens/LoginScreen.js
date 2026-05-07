import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { ChevronLeft, Lock, Mail } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../config/firebase'; // ← FIX BUG 4: era "rtdb", es "db"
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

// ← FIX BUG 1: DEBE estar FUERA del componente, no dentro de un useEffect
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // FIX BUG 2 y 3: sin expoClientId, sin useProxy
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '622102470878-l9i730s0tnbj7bi7m4tqjdkcbv25saki.apps.googleusercontent.com',
    webClientId: '622102470878-2hlejbsjp9mc4kp9cqjelfqdghccr13c.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  }); 
  const { triggerGoogle, focusEmail } = route?.params || {};
  useEffect(() => {
    if (triggerGoogle && request) {
    promptAsync();
    }
  }, [triggerGoogle, request]);


  
  // FIX BUG 3: el resultado de Google se maneja acá, no dentro de handleGoogleLogin
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const googleProfile = {
            uid: user.uid,
            name: user.displayName || 'Usuario',
            email: user.email,
            photo: user.photoURL,
            provider: 'google',
            createdAt: new Date().toISOString(),
          };
          await set(ref(db, `users/${user.uid}`), googleProfile);
          Alert.alert('Éxito', `¡Bienvenido ${googleProfile.name}!`);
        })
        .catch((error) => {
          console.error('Error credencial Google:', error);
          Alert.alert('Error', error.message || 'No se pudo iniciar sesión con Google');
        });
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Hubo un problema con Google Sign-In. Intentá de nuevo.');
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Error', 'Google Sign-In aún se está inicializando. Intentá de nuevo.');
      return;
    }
    setLoading(true);
    try {
      await promptAsync(); // ← sin useProxy ni extraParams
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error con Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresá tus credenciales');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error de Login', 'Credenciales incorrectas o usuario no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('Onboarding')
        }
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/disainerlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Mail color={COLORS.primaryContainer} size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Lock color={COLORS.primaryContainer} size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, (!request || loading) && { opacity: 0.6 }]}
              onPress={handleGoogleLogin}
              disabled={loading || !request}
            >
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
                }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tenés cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.footerLink}>Registrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, padding: SPACING.margin, justifyContent: 'center' },
  backButton: {
    padding: 20,
    alignSelf: 'flex-start',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    zIndex: 999,
    elevation: 5,
  },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  title: { ...TYPOGRAPHY.headlineLG, color: '#fff', textAlign: 'center' },
  subtitle: {
    ...TYPOGRAPHY.bodyMD,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: { marginBottom: 20 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: '#fff', ...TYPOGRAPHY.bodyMD },
  loginButton: {
    backgroundColor: COLORS.primaryContainer,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: {
    color: COLORS.onSurfaceVariant,
    paddingHorizontal: 15,
    ...TYPOGRAPHY.labelSM,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleIcon: { width: 24, height: 24, marginRight: 12 },
  googleButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: COLORS.onSurfaceVariant, ...TYPOGRAPHY.bodyMD },
  footerLink: { color: COLORS.primaryContainer, ...TYPOGRAPHY.bodyMD, fontWeight: 'bold' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
});

export default LoginScreen;