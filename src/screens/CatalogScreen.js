import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, StatusBar } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { ShoppingCart, ChevronDown, ChevronUp, Plus, Check, ChevronLeft } from 'lucide-react-native';
import { useCart } from '../hooks/useCart';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATALOG_DATA = [
  {
    id: 'grafico',
    title: 'Diseño Gráfico',
    subtitle: 'Sistemas Visuales',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Qué archivos recibo?', a: 'Entregamos archivos en alta resolución (PDF, PNG) y los originales editables (AI/PSD).' },
      { q: '¿Cuántas revisiones tengo?', a: 'Cada pack incluye 3 rondas de ajustes sobre la propuesta elegida.' }
    ],
    questionnaire: [
      '¿Cuál es el nombre exacto que debe aparecer?',
      '¿Tenés alguna preferencia de colores o estilo?',
      '¿Quién es tu público objetivo?'
    ],
    packages: [
      { id: 'g1', name: 'Start', price: 120, features: ['3 piezas básicas', 'Adaptación impresión'] },
      { id: 'g2', name: 'Professional', price: 250, features: ['Pack Start', 'Díptico/Tríptico', 'Señalética'] },
      { id: 'g3', name: 'Full Experience', price: 450, features: ['Pack Pro', 'Gran formato', 'Supervisión imprenta'] },
    ]
  },
  {
    id: 'branding',
    title: 'Branding',
    subtitle: 'Identidad Corporativa',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Incluye registro de marca?', a: 'No, el servicio es de diseño. Te asesoramos para que lo hagas en el INPI.' },
      { q: '¿Qué es el manual de marca?', a: 'Es una guía técnica sobre cómo usar tu logo, colores y tipografías correctamente.' }
    ],
    questionnaire: [
      '¿Qué valores definen a tu empresa?',
      '¿Tenés un eslogan o frase de marca?',
      '¿Qué sensaciones querés transmitir?'
    ],
    packages: [
      { id: 'b1', name: 'Pack Start (MVP)', price: 200, features: ['Logotipo original', 'Paleta técnica', 'Tipografías'] },
      { id: 'b2', name: 'Pack Identity (Pro)', price: 500, features: ['Pack Start', 'Manual de marca', 'Papelería'] },
      { id: 'b3', name: 'Pack Total (Full)', price: 950, features: ['Pack Identity', 'Estrategia voz', 'Social Media Assets'] },
    ]
  },
  {
    id: 'web',
    title: 'Desarrollo Web',
    subtitle: 'Soluciones Digitales',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿El hosting está incluido?', a: 'El primer año de hosting y dominio .com.ar está bonificado en los packs Pro y Premium.' },
      { q: '¿Es autogestionable?', a: 'Sí, entregamos un panel para que puedas subir contenidos sin depender de nosotros.' }
    ],
    questionnaire: [
      '¿Cuál es el objetivo principal de la web?',
      '¿Tenés dominio registrado?',
      '¿Qué secciones necesitas (Inicio, Nosotros, Servicios, etc)?'
    ],
    packages: [
      { id: 'w1', name: 'Landing Page', price: 350, features: ['Diseño Bento Grid', 'Responsive', 'Zárate SEO'] },
      { id: 'w2', name: 'Corporate Site', price: 800, features: ['5 secciones', 'Glassmorphism', 'Auto-gestionable'] },
      { id: 'w3', name: 'Premium Web', price: 1800, features: ['Corporate + Animaciones 3D', 'Integración APIs', 'Blog'] },
    ]
  },
  {
    id: 'uxui',
    title: 'UX/UI',
    subtitle: 'Diseño de Interfaces',
    image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Programan la aplicación?', a: 'Este servicio es estrictamente de diseño y prototipado (Figma). La programación es aparte.' },
      { q: '¿Hacen testeos con usuarios?', a: 'En el pack Product Design incluimos pruebas de navegación con usuarios reales.' }
    ],
    questionnaire: [
      '¿Qué problema busca resolver tu App/Web?',
      '¿Tenés algún referente o competencia que te guste?',
      '¿En qué dispositivos se usará principalmente?'
    ],
    packages: [
      { id: 'u1', name: 'Blueprints', price: 150, features: ['Arquitectura info', 'Wireframes'] },
      { id: 'u2', name: 'Visual UI', price: 400, features: ['Prototipo Figma', 'Sistema modular', 'Dark Mode'] },
      { id: 'u3', name: 'Product Design', price: 900, features: ['Prototipo completo', 'Test usabilidad', 'Docs técnicos'] },
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    subtitle: 'Venta Online',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Qué medios de pago integran?', a: 'Mercado Pago, PayPal, Stripe y Transferencia Bancaria.' },
      { q: '¿Cargan mis productos?', a: 'Cargamos los primeros 10-20 productos para configurar el sitio y luego te enseñamos a hacerlo.' }
    ],
    questionnaire: [
      '¿Qué tipo de productos vas a vender?',
      '¿Hacés envíos a todo el país?',
      '¿Cuántos productos estimás tener en total?'
    ],
    packages: [
      { id: 'e1', name: 'Store Start', price: 600, features: ['Catálogo productos', 'Pasarela pagos'] },
      { id: 'e2', name: 'Business Plus', price: 1100, features: ['Store Start', 'Gestión stock', 'Notificaciones mail'] },
      { id: 'e3', name: 'Global Shop', price: 2500, features: ['Business Plus', 'Logística avanzada', 'Dashboard métricas'] },
    ]
  },
  {
    id: 'social',
    title: 'Social Media',
    subtitle: 'Presencia de Marca',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Publican el contenido?', a: 'En el pack Full Growth nosotros nos encargamos de la programación y publicación.' },
      { q: '¿Incluye respuesta a comentarios?', a: 'La moderación de comunidad es un servicio adicional (Community Management).' }
    ],
    questionnaire: [
      '¿En qué redes sociales querés tener presencia?',
      '¿Tenés fotos de tus productos/servicios?',
      '¿Cuál es el tono de comunicación de tu marca?'
    ],
    packages: [
      { id: 's1', name: 'Feed Design', price: 100, features: ['9 templates editables', 'Alineado identidad'] },
      { id: 's2', name: 'Content Strategy', price: 300, features: ['Templates + Calendario', 'Copys estratégicos'] },
      { id: 's3', name: 'Full Growth', price: 700, features: ['Strategy + Ads', 'Reporte mensual'] },
    ]
  },
  {
    id: 'asesoria',
    title: 'Asesoría',
    subtitle: 'Consultoría Profesional',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800',
    faqs: [
      { q: '¿Es presencial?', a: 'Las asesorías son virtuales por Google Meet, pero pueden ser presenciales en Zárate/Campana con costo extra.' },
      { q: '¿Queda grabada la sesión?', a: 'Sí, te enviamos la grabación y una minuta con los puntos clave tratados.' }
    ],
    questionnaire: [
      '¿En qué área específica necesitás ayuda?',
      '¿Qué dudas principales tenés hoy?',
      '¿Cuál es tu disponibilidad horaria?'
    ],
    packages: [
      { id: 'a1', name: 'Check-up', price: 80, features: ['Auditoría visual 1h'] },
      { id: 'a2', name: 'Strategic Plan', price: 200, features: ['Auditoría + Hoja ruta', 'Mejoras técnicas'] },
      { id: 'a3', name: 'Total Mentor', price: 600, features: ['4 sesiones/mes', 'Supervisión proyectos'] },
    ]
  }
];

const ExpandableService = ({ item, onAdd, onBrief }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('packs'); // 'packs' or 'faq'

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpand} activeOpacity={0.9}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          {expanded ? <ChevronUp color="#fff" size={24} /> : <ChevronDown color="#fff" size={24} />}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'packs' && styles.activeTab]} 
              onPress={() => setActiveTab('packs')}
            >
              <Text style={[styles.tabText, activeTab === 'packs' && styles.activeTabText]}>Packs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'faq' && styles.activeTab]} 
              onPress={() => setActiveTab('faq')}
            >
              <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>FAQ</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'packs' ? (
            <View style={styles.packagesContainer}>
              {item.packages.map((pkg) => (
                <View key={pkg.id} style={styles.packageCard}>
                  <View style={styles.pkgInfo}>
                    <Text style={styles.pkgName}>{pkg.name}</Text>
                    <Text style={styles.pkgPrice}>${pkg.price}</Text>
                    {pkg.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Check color={COLORS.primaryContainer} size={12} />
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.pkgActions}>
                    <TouchableOpacity 
                      style={styles.briefButton} 
                      onPress={() => onBrief(item, pkg)}
                    >
                      <Text style={styles.briefButtonText}>Solicitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.addButton} 
                      onPress={() => onAdd({ ...pkg, id: `${item.id}-${pkg.id}`, name: `${item.title} (${pkg.name})` })}
                    >
                      <Plus color="#000" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.faqContainer}>
              {item.faqs.map((faq, i) => (
                <View key={i} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const CatalogScreenNew = ({ navigation }) => {
  const { addItem, items } = useCart();

  const handleGoToBrief = (service, pack) => {
    navigation.navigate('Brief', { service, pack });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity 
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          >
            <ChevronLeft color={COLORS.onSurface} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Servicios</Text>
        </View>
        <TouchableOpacity style={styles.cartBadge} onPress={() => navigation.navigate('Cart')}>
          <ShoppingCart color={COLORS.onSurface} size={24} />
          {items.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{items.length}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CATALOG_DATA.map(item => (
          <ExpandableService 
            key={item.id} 
            item={item} 
            onAdd={addItem} 
            onBrief={handleGoToBrief}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.margin,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
    paddingBottom: 20,
  },
  title: { ...TYPOGRAPHY.headlineLG, color: COLORS.onSurface },
  cartBadge: { position: 'relative' },
  badge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 10, width: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  scrollContent: { paddingHorizontal: SPACING.margin, paddingBottom: 40 },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: { height: 160, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  cardSubtitle: { ...TYPOGRAPHY.labelSM, color: COLORS.primaryFixedDim, textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { ...TYPOGRAPHY.headlineMD, color: '#fff' },
  expandedContent: { backgroundColor: COLORS.surfaceContainer },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryContainer,
  },
  tabText: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurfaceVariant },
  activeTabText: { color: COLORS.primaryContainer, fontWeight: 'bold' },
  packagesContainer: { padding: 15, gap: 12 },
  packageCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pkgInfo: { flex: 1 },
  pkgActions: { alignItems: 'flex-end', gap: 8 },
  pkgName: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, marginBottom: 4 },
  pkgPrice: { ...TYPOGRAPHY.headlineMD, color: '#fff', marginBottom: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  featureText: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, fontSize: 11 },
  addButton: {
    backgroundColor: COLORS.primaryContainer,
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  briefButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  briefButtonText: { ...TYPOGRAPHY.labelSM, color: '#fff', fontSize: 10 },
  faqContainer: { padding: 15, gap: 16 },
  faqItem: { gap: 4 },
  faqQuestion: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, fontWeight: 'bold' },
  faqAnswer: { ...TYPOGRAPHY.bodySM, color: COLORS.onSurfaceVariant, lineHeight: 18 },
});

export default CatalogScreenNew;
