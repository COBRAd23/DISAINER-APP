import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert, KeyboardAvoidingView, Platform, StatusBar, Modal } from 'react-native';
import { Camera, User, Mail, Phone, CreditCard, ChevronRight, LogOut, Save, ChevronLeft, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';
import { useTheme } from '../context/ThemeContext';

// ✅ Fuera del componente para evitar bug del teclado
const InputField = ({ icon: Icon, placeholder, value, onChangeText, keyboardType, COLORS, TYPOGRAPHY, isDark, styles }) => (
  <View style={styles.inputGroup}>
    <View style={styles.inputIcon}>
      <Icon color={COLORS.primaryContainer} size={20} />
    </View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={styles.input}
      autoCorrect={false}
    />
  </View>
);

const PAYMENT_TYPES = [
  { id: 'credit', label: 'Tarjeta de Crédito', icon: '💳' },
  { id: 'debit', label: 'Tarjeta de Débito', icon: '🏦' },
  { id: 'mercadopago', label: 'Mercado Pago', icon: '🛒' },
];

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
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'credit', label: 'Visa •••• 4242', expiry: '12/26' }
  ]);

  // Modal agregar método de pago
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [mpEmail, setMpEmail] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
          if (data.paymentMethods) {
            setPaymentMethods(data.paymentMethods);
          }
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
      setProfile(prev => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await set(ref(db, `users/${auth.currentUser.uid}`), { ...profile, paymentMethods });
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Seleccioná un método de pago');
      return;
    }

    if (selectedType === 'mercadopago') {
      if (!mpEmail) { Alert.alert('Error', 'Ingresá tu email de Mercado Pago'); return; }
      const newMethod = { id: Date.now().toString(), type: 'mercadopago', label: `Mercado Pago (${mpEmail})`, expiry: null };
      setPaymentMethods(prev => [...prev, newMethod]);
    } else {
      if (!cardNumber || cardNumber.length < 4) { Alert.alert('Error', 'Ingresá los últimos 4 dígitos de la tarjeta'); return; }
      if (!cardExpiry) { Alert.alert('Error', 'Ingresá la fecha de vencimiento'); return; }
      const typeLabel = selectedType === 'credit' ? 'Visa' : 'Débito';
      const newMethod = { id: Date.now().toString(), type: selectedType, label: `${typeLabel} •••• ${cardNumber}`, expiry: cardExpiry };
      setPaymentMethods(prev => [...prev, newMethod]);
    }

    // Reset y cerrar
    setModalVisible(false);
    setSelectedType(null);
    setCardNumber('');
    setCardExpiry('');
    setMpEmail('');
  };

  const handleRemovePayment = (id) => {
    Alert.alert('Eliminar', '¿Querés eliminar este método de pago?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setPaymentMethods(prev => prev.filter(p => p.id !== id)) }
    ]);
  };

  const getPaymentIcon = (type) => {
    if (type === 'mercadopago') return '🛒';
    if (type === 'debit') return '🏦';
    return '💳';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0 }}>
            <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
              <ChevronLeft color={COLORS.onSurface} size={28} />
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, marginLeft: 15 }}>Mi Perfil</Text>
          </View>

          {/* Foto */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              <Image source={profile.photo ? { uri: profile.photo } : require('../../assets/images/imagenperfil.jpg')} style={styles.profileImage} />
              {profile.provider !== 'google' && (
                <View style={styles.editBadge}><Camera color="#000" size={14} /></View>
              )}
            </TouchableOpacity>
            <Text style={styles.userName}>{profile.name || 'Usuario Disainer'}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            {profile.provider === 'google' && (
              <View style={styles.googleBadge}><Text style={styles.googleBadgeText}>Cuenta de Google</Text></View>
            )}
          </View>

          {/* Info Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <InputField icon={User} placeholder="Nombre Completo" value={profile.name} onChangeText={(t) => setProfile(prev => ({ ...prev, name: t }))} COLORS={COLORS} TYPOGRAPHY={TYPOGRAPHY} isDark={isDark} styles={styles} />
            <InputField icon={Phone} placeholder="Celular" value={profile.phone} onChangeText={(t) => setProfile(prev => ({ ...prev, phone: t }))} keyboardType="phone-pad" COLORS={COLORS} TYPOGRAPHY={TYPOGRAPHY} isDark={isDark} styles={styles} />
          </View>

          {/* Métodos de Pago */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Métodos de Pago</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Plus color={COLORS.primaryContainer} size={16} />
                <Text style={styles.addText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {paymentMethods.map(method => (
              <TouchableOpacity key={method.id} style={styles.paymentCard} onLongPress={() => handleRemovePayment(method.id)}>
                <Text style={{ fontSize: 24 }}>{getPaymentIcon(method.type)}</Text>
                <View style={styles.paymentDetails}>
                  <Text style={styles.cardInfo}>{method.label}</Text>
                  {method.expiry && <Text style={styles.cardExpiry}>Exp: {method.expiry}</Text>}
                  {method.type === 'mercadopago' && <Text style={styles.cardExpiry}>Mantenés presionado para eliminar</Text>}
                </View>
                <ChevronRight color={COLORS.onSurfaceVariant} size={20} />
              </TouchableOpacity>
            ))}

            {paymentMethods.length === 0 && (
              <Text style={{ color: COLORS.onSurfaceVariant, ...TYPOGRAPHY.bodyMD }}>No tenés métodos de pago agregados.</Text>
            )}
          </View>

          {/* Guardar */}
          <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
            <Save color="#000" size={20} style={{ marginRight: 10 }} />
            <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
          </TouchableOpacity>

          {/* Cerrar sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
            <LogOut color={COLORS.error} size={20} style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Agregar Método de Pago */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Método de Pago</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={COLORS.onSurface} size={24} />
              </TouchableOpacity>
            </View>

            {/* Selector de tipo */}
            <Text style={styles.modalLabel}>Tipo de pago</Text>
            <View style={styles.typeRow}>
              {PAYMENT_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.typeBtn, selectedType === type.id && styles.typeBtnActive]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={{ fontSize: 20 }}>{type.icon}</Text>
                  <Text style={[styles.typeBtnText, selectedType === type.id && { color: '#000' }]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campos según tipo */}
            {(selectedType === 'credit' || selectedType === 'debit') && (
              <View>
                <Text style={styles.modalLabel}>Últimos 4 dígitos</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="4242"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoCorrect={false}
                />
                <Text style={styles.modalLabel}>Vencimiento (MM/AA)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="12/26"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  autoCorrect={false}
                />
              </View>
            )}

            {selectedType === 'mercadopago' && (
              <View>
                <Text style={styles.modalLabel}>Email de Mercado Pago</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="tu@email.com"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={mpEmail}
                  onChangeText={setMpEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddPayment}>
              <Text style={styles.modalSaveBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  imageContainer: { position: 'relative', marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primaryContainer, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.background },
  userName: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  userEmail: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, opacity: 0.7, marginTop: 4 },
  googleBadge: { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  googleBadgeText: { fontSize: 10, color: COLORS.onSurface, opacity: 0.8 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, marginBottom: 15, letterSpacing: 1 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { ...TYPOGRAPHY.labelSM, color: COLORS.primaryContainer },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainer, borderRadius: 12, marginBottom: 12, paddingHorizontal: 15, height: 56, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)' },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: COLORS.onSurface, ...TYPOGRAPHY.bodyMD },
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)' },
  paymentDetails: { flex: 1, marginLeft: 15 },
  cardInfo: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurface },
  cardExpiry: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant },
  saveButton: { backgroundColor: COLORS.primaryContainer, flexDirection: 'row', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: isDark ? 'rgba(255,75,75,0.2)' : 'rgba(255,75,75,0.8)' },
  logoutText: { color: COLORS.error, ...TYPOGRAPHY.labelMD },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.surfaceContainer, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  modalLabel: { ...TYPOGRAPHY.labelSM, color: COLORS.primaryFixedDim, marginBottom: 8, marginTop: 16, letterSpacing: 1 },
  typeRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  typeBtn: { flex: 1, minWidth: '30%', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', gap: 6 },
  typeBtnActive: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primaryContainer },
  typeBtnText: { fontSize: 11, color: COLORS.onSurface, textAlign: 'center', fontWeight: 'bold' },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: COLORS.onSurface, ...TYPOGRAPHY.bodyMD, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalSaveBtn: { backgroundColor: COLORS.primaryContainer, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  modalSaveBtnText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
});

export default ProfileScreen;