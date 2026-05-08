import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar, ActivityIndicator, Alert, Share } from 'react-native';
import { ChevronLeft, Receipt, Share2, Package } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { auth, db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

const BillingHistoryScreen = ({ navigation }) => {
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
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        setOrders(list);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleShareReceipt = async (order) => {
    const receiptText = `
🧾 COMPROBANTE DE PAGO — DISAINER
━━━━━━━━━━━━━━━━━━━━
ID de Compra: ${order.id}
Fecha: ${new Date(order.purchaseDate).toLocaleDateString('es-AR')}
Estado: En Proceso
━━━━━━━━━━━━━━━━━━━━
SERVICIOS ADQUIRIDOS:
${order.items?.map(i => `• ${i.name}`).join('\n') || '—'}
━━━━━━━━━━━━━━━━━━━━
TOTAL: $${order.total?.toLocaleString('es-AR') || '—'}
━━━━━━━━━━━━━━━━━━━━
Gracias por confiar en Disainer 💛
    `.trim();

    try {
      await Share.share({ message: receiptText, title: 'Comprobante Disainer' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el comprobante');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Facturación</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primaryContainer} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Package color={COLORS.primaryContainer} size={48} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Sin compras todavía</Text>
          <Text style={styles.emptySubtitle}>Tus comprobantes de pago van a aparecer acá.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.receiptIcon}>
                  <Receipt color={COLORS.primaryContainer} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.orderId}>ID: {order.id.slice(0, 12).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{new Date(order.purchaseDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>En Proceso</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemsList}>
                {order.items?.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemName}>• {item.name}</Text>
                    {item.price && <Text style={styles.itemPrice}>${item.price?.toLocaleString('es-AR')}</Text>}
                  </View>
                ))}
              </View>

              {order.total && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text style={styles.totalAmount}>${order.total?.toLocaleString('es-AR')}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.shareBtn} onPress={() => handleShareReceipt(order)}>
                <Share2 color="#000" size={16} style={{ marginRight: 8 }} />
                <Text style={styles.shareBtnText}>Compartir Comprobante</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const getStyles = ({ COLORS, TYPOGRAPHY, SPACING, isDark }) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.margin, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10 },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  scrollContent: { padding: SPACING.margin, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, textAlign: 'center' },
  orderCard: { backgroundColor: COLORS.surfaceContainer, borderRadius: 20, marginBottom: 16, padding: 20, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
  orderHeader: { flexDirection: 'row', alignItems: 'center' },
  receiptIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  orderId: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, fontWeight: 'bold' },
  orderDate: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginTop: 2 },
  statusBadge: { backgroundColor: COLORS.primaryContainer, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },
  itemsList: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, flex: 1 },
  itemPrice: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12, marginBottom: 16 },
  totalLabel: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, letterSpacing: 1 },
  totalAmount: { ...TYPOGRAPHY.headlineMD, color: COLORS.primaryContainer },
  shareBtn: { flexDirection: 'row', backgroundColor: COLORS.primaryContainer, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  shareBtnText: { color: '#000', ...TYPOGRAPHY.labelMD, fontWeight: 'bold' },
});

export default BillingHistoryScreen;