import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Camera, User, Mail, Phone, CreditCard, ChevronRight, LogOut, Save, ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, rtdb } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });
  const [profile, setProfile] = useState({
    name: '',
    email: auth.currentUser?.email || '',
    phone: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(rtdb, `users/${auth.currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
        }
      });
    }
  }, []);

  const pickImage = async () => {
    if (profile.provider === 'google') {
      Alert.alert('Cuenta de Google', 'La foto de perfil se gestiona desde tu cuenta de Google.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfile({ ...profile, photo: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await set(ref(rtdb, `users/${auth.currentUser.uid}`), profile);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header con botón volver */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0 }}>
            <TouchableOpacity 
              onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <ChevronLeft color={COLORS.onSurface} size={28} />
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, marginLeft: 15 }}>Mi Perfil</Text>
          </View>

          {/* Header con Foto */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              <Image 
                source={profile.photo ? { uri: profile.photo } : require('../../assets/images/imagenperfil.jpg')} 
                style={styles.profileImage} 
              />
              {profile.provider !== 'google' && (
                <View style={styles.editBadge}>
                  <Camera color="#000" size={14} />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.userName}>{profile.name || 'Usuario Disainer'}</Text>
            </View>
            <Text style={styles.userEmail}>{profile.email}</Text>
            {profile.provider === 'google' && (
              <View style={styles.googleBadge}>
                <Text style={styles.googleBadgeText}>Cuenta de Google</Text>
              </View>
            )}
          </View>

          {/* Formulario */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User color={COLORS.primaryContainer} size={20} />
              </View>
              <TextInput
                placeholder="Nombre Completo"
                placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone color={COLORS.primaryContainer} size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Celular"
                placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Métodos de Pago */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Métodos de Pago</Text>
              <TouchableOpacity>
                <Text style={styles.addText}>+ Agregar</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentCard}>
              <CreditCard color={COLORS.onSurface} size={24} />
              <View style={styles.paymentDetails}>
                <Text style={styles.cardInfo}>Visa •••• 4242</Text>
                <Text style={styles.cardExpiry}>Exp: 12/26</Text>
              </View>
              <ChevronRight color={COLORS.onSurfaceVariant} size={20} />
            </View>
          </View>

          {/* Botones de Acción */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && { opacity: 0.7 }]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Save color="#000" size={20} style={{ marginRight: 10 }} />
            <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
            <LogOut color={COLORS.error} size={20} style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  imageContainer: { position: 'relative', marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  placeholderImage: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: COLORS.surfaceContainer, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primaryContainer,
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: COLORS.background
  },
  userName: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  userEmail: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, opacity: 0.7, marginTop: 4 },
  googleBadge: { 
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
    paddingHorizontal: 10, paddingVertical: 4, 
    borderRadius: 12, marginTop: 8 
  },
  googleBadgeText: { fontSize: 10, color: COLORS.onSurface, opacity: 0.8 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, marginBottom: 15, letterSpacing: 1 },
  addText: { ...TYPOGRAPHY.labelSM, color: COLORS.primaryContainer },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: COLORS.onSurface, ...TYPOGRAPHY.bodyMD },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'
  },
  paymentDetails: { flex: 1, marginLeft: 15 },
  cardInfo: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurface },
  cardExpiry: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant },
  saveButton: {
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  saveButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  logoutButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,75,75,0.2)' : 'rgba(255,75,75,0.8)'
  },
  logoutText: { color: COLORS.error, ...TYPOGRAPHY.labelMD }
});

export default ProfileScreen;
