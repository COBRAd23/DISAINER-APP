import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Camera, User, Mail, Lock, Phone, MapPin, ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, rtdb } from '../config/firebase';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { ref, set } from 'firebase/database';

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  const handleSignup = async () => {
    const { email, password, firstName, lastName, phone, address, photo } = formData;
    
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guardar datos adicionales en Realtime Database
      await set(ref(rtdb, `users/${user.uid}`), {
        firstName,
        lastName,
        email,
        phone,
        address,
        photo, // Nota: En producción, la foto debería subirse a Firebase Storage
        createdAt: new Date().toISOString(),
      });

      // La navegación se manejará automáticamente por el listener de Auth en App.js
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      const googleProfile = {
        firstName: 'Agustín',
        lastName: '(Google)',
        name: 'Agustín (Google)',
        email: 'agustin@gmail.com',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      
      await set(ref(rtdb, `users/${user.uid}`), googleProfile);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar con Google');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize = 'none' }) => (
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
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Onboarding')}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
                  onChangeText={(t) => setFormData({...formData, firstName: t})} 
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField 
                  icon={User} 
                  placeholder="Apellido" 
                  value={formData.lastName} 
                  onChangeText={(t) => setFormData({...formData, lastName: t})} 
                  autoCapitalize="words"
                />
              </View>
            </View>

            <InputField 
              icon={Mail} 
              placeholder="Email" 
              value={formData.email} 
              onChangeText={(t) => setFormData({...formData, email: t})} 
              keyboardType="email-address"
            />
            
            <InputField 
              icon={Lock} 
              placeholder="Contraseña" 
              value={formData.password} 
              onChangeText={(t) => setFormData({...formData, password: t})} 
              secureTextEntry 
            />

            <InputField 
              icon={Phone} 
              placeholder="Celular (Opcional)" 
              value={formData.phone} 
              onChangeText={(t) => setFormData({...formData, phone: t})} 
              keyboardType="phone-pad"
            />

            <InputField 
              icon={MapPin} 
              placeholder="Dirección (Opcional)" 
              value={formData.address} 
              onChangeText={(t) => setFormData({...formData, address: t})} 
            />
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, loading && { opacity: 0.7 }]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.signupButtonText}>Crear Cuenta</Text>}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleSignup}
            disabled={loading}
          >
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png' }} 
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
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
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
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: COLORS.surfaceContainer, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primaryContainer,
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#000'
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
    borderColor: 'rgba(255,255,255,0.05)'
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: '#fff', ...TYPOGRAPHY.bodyMD },
  signupButton: {
    backgroundColor: COLORS.primaryContainer,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  signupButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: COLORS.onSurfaceVariant, paddingHorizontal: 15, ...TYPOGRAPHY.labelSM },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  googleIcon: { width: 24, height: 24, marginRight: 12 },
  googleButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: COLORS.onSurfaceVariant, ...TYPOGRAPHY.bodyMD },
  footerLink: { color: COLORS.primaryContainer, ...TYPOGRAPHY.bodyMD, fontWeight: 'bold' }
});

export default SignupScreen;
