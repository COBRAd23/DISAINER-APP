import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { ChevronLeft, Lock, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';

const PrivacySettingsScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'La contraseña actual es incorrecta');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Eliminar Cuenta',
      'Esta acción es irreversible. Se eliminarán todos tus datos, proyectos y métodos de pago. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmación',
              'Ingresá tu contraseña para confirmar',
              async (password) => {
                if (!password) return;
                setLoading(true);
                try {
                  const user = auth.currentUser;
                  const credential = EmailAuthProvider.credential(user.email, password);
                  await reauthenticateWithCredential(user, credential);
                  await deleteUser(user);
                } catch (error) {
                  Alert.alert('Error', 'No se pudo eliminar la cuenta. Verificá tu contraseña.');
                } finally {
                  setLoading(false);
                }
              },
              'secure-text'
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad y Seguridad</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Cambiar Contraseña */}
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        <View style={styles.card}>
          {/* Contraseña actual */}
          <View style={styles.inputGroup}>
            <Lock color={COLORS.primaryContainer} size={20} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff color={COLORS.onSurfaceVariant} size={20} /> : <Eye color={COLORS.onSurfaceVariant} size={20} />}
            </TouchableOpacity>
          </View>

          {/* Nueva contraseña */}
          <View style={styles.inputGroup}>
            <Lock color={COLORS.primaryContainer} size={20} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff color={COLORS.onSurfaceVariant} size={20} /> : <Eye color={COLORS.onSurfaceVariant} size={20} />}
            </TouchableOpacity>
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputGroup}>
            <Lock color={COLORS.primaryContainer} size={20} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>Actualizar Contraseña</Text>}
          </TouchableOpacity>
        </View>

        {/* Eliminar Cuenta */}
        <Text style={styles.sectionTitle}>Zona de Peligro</Text>
        <View style={styles.card}>
          <Text style={styles.dangerText}>
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos, proyectos, mensajes y métodos de pago. Esta acción no se puede deshacer.
          </Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Trash2 color="#fff" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.deleteBtnText}>Eliminar mi cuenta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.margin, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10 },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  sectionTitle: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, marginBottom: 25, padding: 20 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, color: COLORS.onSurface, ...TYPOGRAPHY.bodyMD },
  saveBtn: { backgroundColor: COLORS.primaryContainer, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
  dangerText: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, marginBottom: 20, lineHeight: 22 },
  deleteBtn: { flexDirection: 'row', backgroundColor: '#c0392b', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  deleteBtnText: { color: '#fff', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
});

export default PrivacySettingsScreen;