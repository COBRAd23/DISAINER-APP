import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar, Linking } from 'react-native';
import { ChevronLeft, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const FAQS = [
  {
    id: '1',
    question: '¿Cuánto tarda en completarse mi proyecto?',
    answer: 'Los tiempos varían según el servicio. Los proyectos de diseño gráfico toman entre 3 a 7 días hábiles. Los proyectos de branding completo pueden tomar de 2 a 4 semanas. Podés ver la fecha estimada de entrega en Mis Proyectos.'
  },
  {
    id: '2',
    question: '¿Puedo pedir cambios en mi proyecto?',
    answer: 'Sí, incluimos hasta 2 rondas de revisiones sin costo adicional. Si necesitás más cambios, podemos cotizarlos. Escribinos por WhatsApp o mensajes dentro de la app.'
  },
  {
    id: '3',
    question: '¿Cómo recibo los archivos finales?',
    answer: 'Los archivos finales se entregan en formato digital (PDF, PNG, AI, o el formato que necesites) a través de un link de descarga que te enviamos por mensaje dentro de la app y por email.'
  },
  {
    id: '4',
    question: '¿Puedo cancelar mi pedido?',
    answer: 'Podés cancelar dentro de las primeras 24 horas de realizado el pedido. Pasado ese tiempo, el trabajo ya puede estar en proceso. Contactanos por WhatsApp para gestionar tu caso.'
  },
  {
    id: '5',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito, y Mercado Pago. Podés gestionar tus métodos de pago desde tu Perfil.'
  },
  {
    id: '6',
    question: '¿Trabajan con empresas o solo con particulares?',
    answer: 'Trabajamos con ambos. Tenemos paquetes adaptados para emprendedores, pymes y empresas. Si necesitás una propuesta personalizada, contactanos directamente.'
  },
];

// ✅ Fuera del componente
const FaqItem = ({ item, styles, COLORS }) => {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        {open
          ? <ChevronUp color={COLORS.primaryContainer} size={18} />
          : <ChevronDown color={COLORS.onSurfaceVariant} size={18} />
        }
      </View>
      {open && <Text style={styles.faqAnswer}>{item.answer}</Text>}
    </TouchableOpacity>
  );
};

const HelpCenterScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Contacto directo */}
        <Text style={styles.sectionTitle}>Contacto Directo</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Linking.openURL('https://wa.me/5491161030981?text=Hola! Necesito ayuda con mi proyecto en Disainer.')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#25D366' }]}>
              <MessageCircle color="#fff" size={24} />
            </View>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactSub}>Respuesta rápida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Linking.openURL('mailto:hola@disainer.com?subject=Consulta desde la app')}
          >
            <View style={[styles.contactIcon, { backgroundColor: COLORS.primaryContainer }]}>
              <Mail color="#000" size={24} />
            </View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactSub}>hola@disainer.com</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <View style={styles.faqContainer}>
          {FAQS.map(item => (
            <FaqItem key={item.id} item={item} styles={styles} COLORS={COLORS} />
          ))}
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
  sectionTitle: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 16, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  contactRow: { flexDirection: 'row', gap: 16, marginBottom: 30 },
  contactBtn: { flex: 1, backgroundColor: COLORS.surfaceContainer, borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
  contactIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  contactLabel: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, fontWeight: 'bold', marginBottom: 4 },
  contactSub: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, textAlign: 'center' },
  faqContainer: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, overflow: 'hidden' },
  faqItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, flex: 1, marginRight: 12 },
  faqAnswer: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, marginTop: 12, lineHeight: 22 },
});

export default HelpCenterScreen;