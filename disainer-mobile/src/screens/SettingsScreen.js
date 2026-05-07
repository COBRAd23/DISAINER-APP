import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, StatusBar, Platform, Alert } from 'react-native';
import { ChevronLeft, Bell, Lock, Eye, CreditCard, HelpCircle, Info } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const SettingItem = ({ icon: Icon, title, type = 'link', value, onValueChange, onPress, styles, COLORS }) => (
  <TouchableOpacity style={styles.settingItem} onPress={type === 'link' ? onPress : null} activeOpacity={type === 'link' ? 0.7 : 1}>
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

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleLinkPress = (title) => {
    Alert.alert(title, `Configuración de ${title} en desarrollo.`);
  };

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
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <SettingItem icon={Bell} title="Notificaciones Push" type="switch" value={pushEnabled} onValueChange={setPushEnabled} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Lock} title="Privacidad y Seguridad" onPress={() => handleLinkPress('Privacidad y Seguridad')} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Eye} title="Modo Oscuro" type="switch" value={isDark} onValueChange={handleDarkModeToggle} styles={styles} COLORS={COLORS} />
        </View>

        <Text style={styles.sectionTitle}>Pagos</Text>
        <View style={styles.card}>
          <SettingItem icon={CreditCard} title="Mis Tarjetas" onPress={() => handleLinkPress('Mis Tarjetas')} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Info} title="Historial de Facturación" onPress={() => handleLinkPress('Historial de Facturación')} styles={styles} COLORS={COLORS} />
        </View>

        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.card}>
          <SettingItem icon={HelpCircle} title="Centro de Ayuda" onPress={() => handleLinkPress('Centro de Ayuda')} styles={styles} COLORS={COLORS} />
          <SettingItem icon={Info} title="Términos y Condiciones" onPress={() => handleLinkPress('Términos y Condiciones')} styles={styles} COLORS={COLORS} />
        </View>
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
  scrollContent: { padding: SPACING.margin },
  sectionTitle: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 15, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, marginBottom: 25, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(150,150,150,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingTitle: { flex: 1, ...TYPOGRAPHY.bodyMD, color: COLORS.onSurface }
});

export default SettingsScreen;
