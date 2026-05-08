import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, StatusBar, Platform, Linking, Alert } from 'react-native';
import { ChevronLeft, Bell, Lock, Eye, CreditCard, HelpCircle, Info, FileText, ShieldCheck, Receipt } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

// ✅ Fuera del componente
const SettingItem = ({ icon: Icon, title, type = 'link', value, onValueChange, onPress, styles, COLORS, isLast }) => (
  <TouchableOpacity
    style={[styles.settingItem, isLast && styles.settingItemLast]}
    onPress={type === 'link' ? onPress : null}
    activeOpacity={type === 'link' ? 0.7 : 1}
  >
    <View style={styles.iconContainer}>
      <Icon color={COLORS.primaryContainer} size={20} />
    </View>
    <Text style={styles.settingTitle}>{title}</Text>
    {type === 'link' ? (
      <View style={{ transform: [{ rotate: '180deg' }] }}>
        <ChevronLeft color={COLORS.onSurfaceVariant} size={20} />
      </View>
    ) : (
      <Switch
        trackColor={{ false: '#333', true: COLORS.primaryContainer }}
        thumbColor={COLORS.onSurface}
        value={value}
        onValueChange={onValueChange}
      />
    )}
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark, toggleTheme } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING });
  const [pushEnabled, setPushEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <SettingItem icon={Bell} title="Notificaciones Push" type="switch" value={pushEnabled} onValueChange={setPushEnabled} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Eye} title="Modo Oscuro" type="switch" value={isDark} onValueChange={toggleTheme} styles={styles} COLORS={COLORS} />
          <SettingItem icon={ShieldCheck} title="Privacidad y Seguridad" onPress={() => navigation.navigate('PrivacySettings')} styles={styles} COLORS={COLORS} isLast />
        </View>

        {/* Pagos */}
        <Text style={styles.sectionTitle}>Pagos</Text>
        <View style={styles.card}>
          <SettingItem icon={CreditCard} title="Mis Tarjetas" onPress={() => navigation.navigate('Profile')} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Receipt} title="Historial de Facturación" onPress={() => navigation.navigate('BillingHistory')} styles={styles} COLORS={COLORS} isLast />
        </View>

        {/* Soporte */}
        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.card}>
          <SettingItem icon={HelpCircle} title="Centro de Ayuda" onPress={() => navigation.navigate('HelpCenter')} styles={styles} COLORS={COLORS} />
          <SettingItem icon={FileText} title="Términos y Condiciones" onPress={() => navigation.navigate('TermsScreen')} styles={styles} COLORS={COLORS} isLast />
        </View>

        <Text style={styles.version}>Disainer v1.0.0 · Hecho con 💛 en Argentina</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.margin,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10
  },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  sectionTitle: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, marginBottom: 25, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  settingItemLast: { borderBottomWidth: 0 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(150,150,150,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingTitle: { flex: 1, ...TYPOGRAPHY.bodyMD, color: COLORS.onSurface },
  version: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, textAlign: 'center', marginTop: 10, opacity: 0.5 },
});

export default SettingsScreen;