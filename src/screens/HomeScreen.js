import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, ImageBackground, Dimensions, Modal, StatusBar, Platform, Linking } from 'react-native';
import { ShoppingCart, User, Settings, Bell, Menu, Folder, MessageSquare, Star, X, CheckCircle2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../config/firebase';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const { width, height } = Dimensions.get('window');

const BentoCard = ({ title, subtitle, size = 'small', image, icon: Icon, onPress, styles, COLORS }) => (
  <TouchableOpacity 
    style={[
      styles.card, 
      size === 'large' && styles.largeCard,
      size === 'wide' && styles.wideCard,
      size === 'medium' && styles.mediumCard,
    ]}
    onPress={onPress}
  >
    <ImageBackground 
      source={typeof image === 'string' ? { uri: image } : image} 
      style={styles.cardBg}
      imageStyle={{ borderRadius: 16 }}
    >
      <View style={styles.cardOverlay}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon color={COLORS.primaryContainer} size={24} />
            {size === 'large' && <View style={styles.folderCircle}><View style={styles.folderInner} /></View>}
          </View>
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [projectCount, setProjectCount] = useState(0); // ← NUEVO
  const { items } = useCart();
  const { COLORS, TYPOGRAPHY, SPACING, isDark } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const styles = getStyles({ COLORS, TYPOGRAPHY, SPACING, isDark });

  // ← NUEVO: leer cantidad de proyectos desde Firebase
  useEffect(() => {
    if (!auth.currentUser) return;
    const ordersRef = ref(db, `orders/${auth.currentUser.uid}`);
    const unsub = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      setProjectCount(data ? Object.keys(data).length : 0);
    });
    return unsub;
  }, []);

  const menuItems = [
    { name: 'PERFIL', screen: 'Profile' },
    { name: 'Mis PROYECTOS', screen: 'Projects' },
    { name: 'MENSAJES', screen: 'Messages' },
    { name: 'CARRITO', screen: 'Cart' },
    { name: 'CATALOGO', screen: 'Catalog' },
    { name: 'CONFIGURACION', screen: 'Settings' },
  ];

  const handleOpenNotifications = () => {
    setNotificationsVisible(true);
    markAllAsRead();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.yellowHeader}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image 
                source={require('../../assets/images/imagenperfil.jpg')} 
                style={styles.avatar} 
              />
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>Hola, Agus!</Text>
                <Text style={styles.dateText}>Miércoles 6 de Mayo</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleOpenNotifications}>
                <View>
                  <Bell color="#000" size={28} />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)}>
                <Menu color="#000" size={32} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>

          {/* ← CONTADOR DINÁMICO */}
          <BentoCard 
            title="Mis PROYECTOS" 
            subtitle={`${projectCount} ${projectCount === 1 ? 'ARCHIVO' : 'ARCHIVOS'}`}
            size="large" 
            image={require('../../assets/images/misproyectos.png')}
            icon={Folder}
            onPress={() => navigation.navigate('Projects')}
            styles={styles} COLORS={COLORS}
          />
          
          <View style={styles.row}>
            <BentoCard 
              title="Carrito" 
              subtitle={`${items.length} ${items.length === 1 ? 'ITEM' : 'ITEMS'}`}
              size="medium"
              image={require('../../assets/images/micarrito.png')}
              icon={ShoppingCart}
              onPress={() => navigation.navigate('Cart')}
              styles={styles} COLORS={COLORS}
            />
            <BentoCard 
              title="Mensajes" 
              subtitle="1 Mensaje" 
              size="medium"
              image={require('../../assets/images/mismensajes.png')}
              icon={MessageSquare}
              onPress={() => navigation.navigate('Messages')}
              styles={styles} COLORS={COLORS}
            />
          </View>

          <BentoCard 
            title="Catálogo de Servicios" 
            size="wide" 
            image={require('../../assets/images/micatalogo.png')}
            icon={Star}
            onPress={() => navigation.navigate('Catalog')}
            styles={styles} COLORS={COLORS}
          />

          <View style={styles.row}>
            <BentoCard 
              title="Perfil" 
              size="medium"
              image={require('../../assets/images/imagenperfil.jpg')}
              icon={User}
              onPress={() => navigation.navigate('Profile')}
              styles={styles} COLORS={COLORS}
            />
            <BentoCard 
              title="Configuración" 
              size="medium"
              image={require('../../assets/images/miconfig.png')}
              icon={Settings}
              onPress={() => navigation.navigate('Settings')}
              styles={styles} COLORS={COLORS}
            />
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Menu Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={styles.menuContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setMenuVisible(false)}>
              <X color={COLORS.primaryContainer} size={32} />
            </TouchableOpacity>
            
            <View style={styles.menuItems}>
              {menuItems.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(item.screen);
                  }}
                >
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={notificationsVisible}
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setNotificationsVisible(false)}
        >
          <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={[styles.menuContainer, { width: width * 0.85, alignItems: 'flex-start' }]}>
            <TouchableOpacity style={[styles.closeBtn, { alignSelf: 'flex-start', marginBottom: 20 }]} onPress={() => setNotificationsVisible(false)}>
              <X color={COLORS.primaryContainer} size={32} />
            </TouchableOpacity>
            
            <Text style={[styles.menuText, { textAlign: 'left', marginBottom: 20 }]}>NOTIFICACIONES</Text>

            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <Text style={{ color: COLORS.onSurfaceVariant, ...TYPOGRAPHY.bodyMD, textAlign: 'center', marginTop: 20 }}>
                  ¡A la espera del próximo aviso! 🔔
                </Text>
              ) : (
                notifications.map((notif) => (
                  <View key={notif.id} style={styles.notificationItem}>
                    <View style={styles.notificationIconContainer}>
                      <CheckCircle2 color={COLORS.primaryContainer} size={24} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notif.title}</Text>
                      <Text style={styles.notificationBody}>{notif.body}</Text>
                      <Text style={styles.notificationTime}>
                        {new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </BlurView>
        </TouchableOpacity>
      </Modal>
      
      {/* Botón WhatsApp Flotante */}
      <TouchableOpacity 
        style={styles.whatsappBtn} 
        onPress={() => Linking.openURL('https://wa.me/5491161030981')}
      >
        <Image 
          source={require('../../assets/images/whatssapp.png')} 
          style={styles.whatsappIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  yellowHeader: {
    backgroundColor: COLORS.primaryContainer,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.margin,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#000' },
  greetingContainer: { marginLeft: 12 },
  greetingText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#000' },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: 12, fontStyle: 'italic', color: '#000', opacity: 0.7 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 4 },
  scrollContent: { padding: SPACING.margin, paddingTop: 20 },
  grid: { gap: 16 },
  row: { flexDirection: 'row', gap: 16 },
  card: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' },
  largeCard: { height: 200, width: '100%' },
  mediumCard: { flex: 1, height: 140 },
  wideCard: { height: 100, width: '100%' },
  cardBg: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'flex-start' },
  iconContainer: { position: 'relative' },
  folderCircle: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primaryContainer, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000' },
  folderInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000' },
  cardTitle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: COLORS.primaryContainer },
  cardSubtitle: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 10, color: '#fff', opacity: 0.8, textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row', justifyContent: 'flex-end' },
  menuContainer: { width: width * 0.7, height: '100%', padding: 30, paddingTop: 60, borderLeftWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' },
  closeBtn: { alignSelf: 'flex-end', marginBottom: 60 },
  menuItems: { gap: 30, alignItems: 'flex-end' },
  menuItem: { paddingVertical: 5 },
  menuText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: COLORS.primaryContainer, textAlign: 'right' },
  whatsappBtn: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryContainer, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, zIndex: 1000 },
  whatsappIcon: { width: 35, height: 35 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.error || '#FF4B4B', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
  notificationIconContainer: { marginRight: 15, marginTop: 2 },
  notificationContent: { flex: 1 },
  notificationTitle: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, marginBottom: 4 },
  notificationBody: { ...TYPOGRAPHY.bodySM, color: COLORS.onSurfaceVariant, marginBottom: 8 },
  notificationTime: { fontSize: 10, color: COLORS.primaryFixedDim, fontStyle: 'italic' },
});

export default HomeScreen;