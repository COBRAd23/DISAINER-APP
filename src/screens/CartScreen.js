import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, Dimensions, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { ChevronLeft, Trash2, ShoppingBag, CreditCard, CheckCircle2, ReceiptText, Download } from 'lucide-react-native';
import { useCart } from '../hooks/useCart';
import { auth, rtdb } from '../config/firebase';
import { ref, push, set } from 'firebase/database';
import { useNotifications } from '../context/NotificationContext';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { items, loading, removeItem, total, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalItems, setFinalItems] = useState([]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Capturamos los datos antes de limpiar el carrito
    const amountToPay = total * 1.21;
    const itemsSnapshot = [...items];
    
    setIsProcessing(true);
    
    // Simulación de procesamiento de pago
    setTimeout(async () => {
      try {
        const newOrder = {
          items: itemsSnapshot,
          total: amountToPay,
          date: new Date().toISOString(),
          status: 'confirmed'
        };

        let generatedId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        if (auth.currentUser) {
          const ordersRef = ref(rtdb, `orders/${auth.currentUser.uid}`);
          const newOrderRef = push(ordersRef);
          
          const purchaseDate = new Date();
          const deliveryDate = new Date();
          deliveryDate.setDate(purchaseDate.getDate() + 15);
          
          await set(newOrderRef, {
            ...newOrder,
            purchaseDate: purchaseDate.toISOString(),
            deliveryDate: deliveryDate.toISOString()
          });
          generatedId = newOrderRef.key;

          // Guardar mensaje de éxito en Firebase
          const messagesRef = ref(rtdb, `messages/${auth.currentUser.uid}`);
          await push(messagesRef, {
            sender: 'Equipo Disainer',
            text: `Gracias por tu compra. Seguimos los detalles por mensaje o WhatsApp para comenzar el proyecto y llegar al resultado deseado.`,
            time: 'Recién',
            date: new Date().toISOString(),
            unread: true
          });

          // Notificación global
          await addNotification('¡Compra Confirmada!', `Tu orden por ${itemsSnapshot.length} item(s) fue procesada y se agregó a tus Proyectos.`, 'success');
        }

        setOrderId(generatedId);
        setFinalTotal(amountToPay);
        setFinalItems(itemsSnapshot);
        
        setIsProcessing(false);
        setShowReceipt(true);
        clearCart();
      } catch (error) {
        console.error('Checkout error:', error);
        setIsProcessing(false);
      }
    }, 2000);
  };

  const ReceiptModal = () => (
    <Modal visible={showReceipt} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.receiptContainer}>
          <View style={styles.successBadge}>
            <CheckCircle2 color={COLORS.primaryContainer} size={40} />
          </View>
          <Text style={styles.receiptTitle}>¡Pago Exitoso!</Text>
          <Text style={styles.receiptSubtitle}>Tu proyecto comienza ahora.</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Orden ID:</Text>
            <Text style={styles.receiptValue}>#{orderId?.slice(-8).toUpperCase()}</Text>
          </View>
          
          <ScrollView style={styles.receiptItems}>
            {finalItems.map((item, idx) => (
              <View key={idx} style={styles.receiptItem}>
                <Text style={styles.receiptItemName}>{item.name}</Text>
                <Text style={styles.receiptItemPrice}>${item.price}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={styles.totalLabel}>Total Final (IVA inc.)</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.doneButton} 
            onPress={() => {
              setShowReceipt(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.doneButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading || isProcessing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primaryContainer} />
        {isProcessing && <Text style={styles.loadingText}>Procesando Pago Seguro...</Text>}
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
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag color={COLORS.onSurfaceVariant} size={64} opacity={0.3} />
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={() => navigation.navigate('Catalog')}
          >
            <Text style={styles.browseButtonText}>Explorar Catálogo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {items.map((item, idx) => (
              <View key={idx} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Trash2 color={COLORS.error} size={20} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>IVA (21%)</Text>
                <Text style={styles.summaryValue}>${(total * 0.21).toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>${(total * 1.21).toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <CreditCard color="#000" size={20} style={{ marginRight: 10 }} />
              <Text style={styles.checkoutButtonText}>Confirmar Compra</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <ReceiptModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, marginTop: 20 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: SPACING.margin,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10
  },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  clearText: { ...TYPOGRAPHY.labelSM, color: COLORS.error },
  scrollContent: { padding: SPACING.margin },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemName: { ...TYPOGRAPHY.bodyLG, color: COLORS.onSurface, fontWeight: '600' },
  itemPrice: { ...TYPOGRAPHY.labelMD, color: COLORS.primaryFixedDim, marginTop: 4 },
  summary: {
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant },
  summaryValue: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface },
  totalRow: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  grandTotalLabel: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  grandTotalValue: { ...TYPOGRAPHY.headlineMD, color: COLORS.primaryContainer },
  footer: { padding: SPACING.margin, paddingBottom: 40 },
  checkoutButton: {
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: { ...TYPOGRAPHY.labelMD, color: '#000', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurfaceVariant, marginTop: 20, marginBottom: 30 },
  browseButton: { 
    backgroundColor: COLORS.surfaceContainerHigh, 
    paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 
  },
  browseButtonText: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface },
  
  // Receipt Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  receiptContainer: { 
    backgroundColor: COLORS.surface, 
    width: width * 0.85, 
    padding: 30, 
    borderRadius: 24, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  successBadge: { marginBottom: 20 },
  receiptTitle: { ...TYPOGRAPHY.headlineLG, color: '#fff', marginBottom: 8 },
  receiptSubtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, marginBottom: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%', marginVertical: 20 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  receiptLabel: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant },
  receiptValue: { ...TYPOGRAPHY.labelMD, color: '#fff', fontWeight: 'bold' },
  receiptItems: { maxHeight: 150, width: '100%' },
  receiptItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  receiptItemName: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurface, flex: 1 },
  receiptItemPrice: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant },
  totalLabel: { ...TYPOGRAPHY.labelMD, color: '#fff' },
  totalValue: { ...TYPOGRAPHY.headlineMD, color: COLORS.primaryContainer },
  doneButton: { 
    backgroundColor: COLORS.primaryContainer, 
    width: '100%', height: 56, 
    borderRadius: 12, justifyContent: 'center', 
    alignItems: 'center', marginTop: 30 
  },
  doneButtonText: { color: '#000', fontWeight: 'bold', ...TYPOGRAPHY.labelMD }
});

export default CartScreen;
