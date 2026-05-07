import * as Google from 'expo-auth-session/providers/google';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { Camera, ChevronLeft, Lock, Mail, MapPin, Phone, User } from 'lucide-react-native';
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
import { auth, db } from '../config/firebase'; // ← FIX: era "rtdb", es "db"
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

// ✅ FIX TECLADO: WebBrowser fuera del componente
WebBrowser.maybeCompleteAuthSession();

// ✅ FIX TECLADO: InputField FUERA del componente SignupScreen
const InputField = ({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
}) => (
  <View style={styles.inputGroup}>
    <View style={styles.inputIcon}>
      <Icon color={COLORS.primaryContainer} size={20} />
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.3)"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
    />
  </View>
);

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    photo: null,
  });

  // ✅ FIX GOOGLE: sin expoClientId, sin useProxy, con response
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '622102470878-l9i730s0tnbj7bi7m4tqjdkcbv25saki.apps.googleusercontent.com',
    webClientId: '622102470878-2hlejbsjp9mc4kp9cqjelfqdghccr13c.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  // ✅ FIX GOOGLE: manejar respuesta en useEffect
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const [firstName, ...rest] = (user.displayName || 'Usuario').split(' ');
          const lastName = rest.join(' ');

          const googleProfile = {
            firstName,
            lastName,
            name: user.displayName || 'Usuario (Google)',
            email: user.email,
            photo: user.photoURL,
            provider: 'google',
            createdAt: new Date().toISOString(),
          };

          await set(ref(db, `users/${user.uid}`), googleProfile);
          Alert.alert('Éxito', `¡Bienvenido ${firstName}!`);
        })
        .catch((error) => {
          console.error('Error Google signup:', error);
          Alert.alert('Error', error.message || 'No se pudo registrar con Google');
        });
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Hubo un problema con Google. Intentá de nuevo.');
    }
  }, [response]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  const handleSignup = async () => {
    const { email, password, firstName, lastName, phone, address, photo } = formData;
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Por favor completá los campos obligatorios');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await set(ref(db, `users/${user.uid}`), {
        firstName,
        lastName,
        email,
        phone,
        address,
        photo,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!request) {
      Alert.alert('Error', 'Google Sign-In aún se está inicializando. Intentá de nuevo.');
      return;
    }
    setLoading(true);
    try {
      await promptAsync(); // ← sin useProxy
    } catch (error) {
      console.error('Google Signup Error:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar con Google');
    } finally {
      setLoading(false);
    }
  };

  // Helper para actualizar formData sin recrear el componente
  const updateField = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Unite a la experiencia Disainer</Text>

          {/* Foto de Perfil */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
              {formData.photo ? (
                <Image source={{ uri: formData.photo }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Camera color={COLORS.onSurfaceVariant} size={30} />
                </View>
              )}
              <View style={styles.editBadge}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>+</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.photoLabel}>Foto de Perfil</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <InputField
                  icon={User}
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChangeText={updateField('firstName')}
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  icon={User}
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChangeText={updateField('lastName')}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <InputField
              icon={Mail}
              placeholder="Email"
              value={formData.email}
              onChangeText={updateField('email')}
              keyboardType="email-address"
            />

            <InputField
              icon={Lock}
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={updateField('password')}
              secureTextEntry
            />

            <InputField
              icon={Phone}
              placeholder="Celular (Opcional)"
              value={formData.phone}
              onChangeText={updateField('phone')}
              keyboardType="phone-pad"
            />

            <InputField
              icon={MapPin}
              placeholder="Dirección (Opcional)"
              value={formData.address}
              onChangeText={updateField('address')}
            />
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.signupButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && { opacity: 0.6 }]}
            onPress={handleGoogleSignup}
            disabled={loading || !request}
          >
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Registrarse con Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Iniciá Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  backButton: {
    padding: 20,
    alignSelf: 'flex-start',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    marginBottom: 10,
    zIndex: 999,
    elevation: 5,
  },
  title: { ...TYPOGRAPHY.headlineLG, color: '#fff' },
  subtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, marginBottom: 30 },
  photoSection: { alignItems: 'center', marginBottom: 30 },
  photoContainer: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primaryContainer,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  photoLabel: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginTop: 10 },
  form: { marginBottom: 20 },
  row: { flexDirection: 'row' },
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
  signupButton: {
    backgroundColor: COLORS.primaryContainer,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
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
});

export default SignupScreen;