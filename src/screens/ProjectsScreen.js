import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { ChevronLeft, ExternalLink, Package } from 'lucide-react-native';
import { auth, db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { useTheme } from '../context/ThemeContext';

const STATIC_PROJECTS = [];

const ProjectsScreen = ({ navigation }) => {
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) { setLoading(false); return; }
    const ordersRef = ref(db, `orders/${auth.currentUser.uid}`);
    const unsub = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          type: data[key].items?.length > 1 ? 'Pack Múltiple' : 'Servicio Adquirido',
          status: 'En Proceso',
          image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800'
        }));
        setOrders(ordersList);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const allProjects = [...orders, ...STATIC_PROJECTS];

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primaryContainer} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Proyectos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Package color={COLORS.primaryContainer} size={48} />
            </View>
            <Text style={styles.emptyTitle}>¡A la espera de tu primer proyecto!</Text>
            <Text style={styles.emptySubtitle}>Cuando realices un pedido en el catálogo, aparecerá aquí para que sigamos el proceso juntos.</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('Catalog')}
            >
              <Text style={styles.browseButtonText}>Explorar Catálogo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          allProjects.map(project => (
            <View key={project.id} style={styles.projectCard}>
              <Image source={{ uri: project.image }} style={styles.projectImage} />
              <View style={styles.projectInfo}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.projectType}>{project.type}</Text>
                  <Text style={styles.projectTitle}>Proyecto Activo</Text>
                  {project.items && project.items.length > 0 && (
                    <View style={styles.detailContainer}>
                      {project.items.map((it, idx) => (
                        <Text key={idx} style={styles.detailItem}>• {it.name}</Text>
                      ))}
                    </View>
                  )}
                  {project.purchaseDate && (
                    <Text style={styles.dateInfo}>Compra: {new Date(project.purchaseDate).toLocaleDateString()}</Text>
                  )}
                  {project.deliveryDate && (
                    <Text style={styles.dateInfo}>Entrega est: {new Date(project.deliveryDate).toLocaleDateString()}</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: project.status === 'En Proceso' ? COLORS.primaryContainer : 'rgba(255,255,255,0.1)' }]}>
                  <Text style={[styles.statusText, { color: project.status === 'En Proceso' ? '#000' : '#fff' }]}>{project.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewDetails}>
                <Text style={styles.viewDetailsText}>Ver Detalles</Text>
                <ExternalLink color={COLORS.primaryFixedDim} size={16} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: SPACING.margin,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10
  },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  scrollContent: { padding: SPACING.margin },
  projectCard: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
  projectImage: { width: '100%', height: 180 },
  projectInfo: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectType: { ...TYPOGRAPHY.labelSM, color: COLORS.primaryFixedDim, textTransform: 'uppercase' },
  projectTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, marginTop: 4, marginBottom: 8 },
  detailContainer: { marginBottom: 10 },
  detailItem: { ...TYPOGRAPHY.bodySM, color: COLORS.onSurfaceVariant, marginBottom: 2 },
  dateInfo: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginBottom: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  viewDetails: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingBottom: 20 },
  viewDetailsText: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyIconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
  emptyTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  browseButton: { backgroundColor: COLORS.primaryContainer, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  browseButtonText: { ...TYPOGRAPHY.labelMD, color: '#000', fontWeight: 'bold' }
});

export default ProjectsScreen;
