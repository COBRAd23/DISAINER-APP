import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  {
    title: '1. Aceptación de los Términos',
    content: 'Al utilizar la aplicación Disainer, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, te pedimos que no utilices nuestra plataforma. Nos reservamos el derecho de actualizar estos términos en cualquier momento.'
  },
  {
    title: '2. Descripción del Servicio',
    content: 'Disainer es una plataforma de servicios de diseño gráfico, branding, desarrollo web y marketing digital. Los servicios se contratan a través de la app y son ejecutados por el equipo de Disainer. Cada servicio tiene sus propios tiempos de entrega y alcances detallados en el catálogo.'
  },
  {
    title: '3. Proceso de Compra',
    content: 'Al confirmar una compra, estás contratando el servicio seleccionado. Recibirás una confirmación con el ID de compra único. El proceso comienza dentro de las 24 horas hábiles de confirmado el pago. Podés seguir el estado desde Mis Proyectos.'
  },
  {
    title: '4. Política de Revisiones',
    content: 'Cada servicio incluye hasta 2 rondas de revisiones sin costo adicional. Las revisiones deben ser solicitadas dentro de los 7 días de recibida la entrega. Cambios fuera del alcance original del servicio pueden generar costos adicionales.'
  },
  {
    title: '5. Cancelaciones y Reembolsos',
    content: 'Podés cancelar tu pedido sin cargo dentro de las primeras 24 horas. Si el trabajo ya está en proceso, se evaluará el reembolso según el avance. No se realizan reembolsos una vez entregados los archivos finales aprobados.'
  },
  {
    title: '6. Propiedad Intelectual',
    content: 'Una vez completado el pago y aprobada la entrega final, los derechos del material diseñado son transferidos al cliente. Disainer se reserva el derecho de utilizar los trabajos realizados en su portfolio, salvo acuerdo de confidencialidad expreso.'
  },
  {
    title: '7. Privacidad de Datos',
    content: 'Tus datos personales son utilizados exclusivamente para la gestión de tu cuenta y la prestación del servicio. No compartimos tu información con terceros sin tu consentimiento. Podés solicitar la eliminación de tus datos en cualquier momento desde Configuración.'
  },
  {
    title: '8. Limitación de Responsabilidad',
    content: 'Disainer no se responsabiliza por daños indirectos derivados del uso del servicio. Nuestra responsabilidad máxima se limita al monto abonado por el servicio contratado. Hacemos nuestro mejor esfuerzo para cumplir los plazos, pero pueden variar por causas de fuerza mayor.'
  },
  {
    title: '9. Contacto',
    content: 'Para cualquier consulta sobre estos términos, podés contactarnos a hola@disainer.com o por WhatsApp al +54 9 11 6103-0981. Nuestro horario de atención es de lunes a viernes de 9 a 18 hs (hora Argentina).'
  },
];

const TermsScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Última actualización: Mayo 2026</Text>

        {SECTIONS.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Disainer. Todos los derechos reservados.</Text>
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
  lastUpdated: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 24, fontStyle: 'italic' },
  section: { marginBottom: 24, backgroundColor: COLORS.surfaceContainer, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
  sectionTitle: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryContainer, marginBottom: 12, fontWeight: 'bold' },
  sectionContent: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, lineHeight: 24 },
  footer: { alignItems: 'center', marginTop: 10 },
  footerText: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, opacity: 0.5 },
});

export default TermsScreen;