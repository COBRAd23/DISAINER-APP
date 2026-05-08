import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { ChevronLeft, MessageCircle, Clock } from 'lucide-react-native';
import { auth, db } from '../config/firebase';
import { ref, onValue, update, remove } from 'firebase/database';

const MessagesScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) { setLoading(false); return; }

    const messagesRef = ref(db, `messages/${auth.currentUser.uid}`);
    const unsub = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Borrar mensajes con más de una semana
        Object.keys(data).forEach(async (key) => {
          const msgDate = new Date(data[key].date);
          if (msgDate < oneWeekAgo) {
            await remove(ref(db, `messages/${auth.currentUser.uid}/${key}`));
          }
        });

        const msgsList = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(msg => new Date(msg.date) >= oneWeekAgo) // filtrar viejos localmente también
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setMessages(msgsList);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleOpenMessage = async (msg) => {
    // Marcar como leído al abrir
    if (msg.unread && auth.currentUser) {
      await update(ref(db, `messages/${auth.currentUser.uid}/${msg.id}`), { unread: false });
    }
    navigation.navigate('ChatDetail', { chat: msg });
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
        <Text style={styles.headerTitle}>Mensajes</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primaryContainer} />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.center}>
          <MessageCircle color={COLORS.primaryContainer} size={48} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Sin mensajes por ahora</Text>
          <Text style={styles.emptySubtitle}>Cuando haya novedades de tu proyecto o realices una compra, te avisamos acá.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {messages.map(msg => (
            <TouchableOpacity 
              key={msg.id} 
              style={[styles.msgCard, msg.unread && styles.unreadCard]}
              onPress={() => handleOpenMessage(msg)}
            >
              <View style={styles.avatar}>
                <MessageCircle color={COLORS.primaryContainer} size={24} />
              </View>
              <View style={styles.msgBody}>
                <View style={styles.msgHeader}>
                  <Text style={styles.senderName}>{msg.sender}</Text>
                  <View style={styles.timeRow}>
                    <Clock color={COLORS.onSurfaceVariant} size={12} />
                    <Text style={styles.timeText}>{msg.time || new Date(msg.date).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={styles.msgText} numberOfLines={1}>{msg.text}</Text>
              </View>
              {msg.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface, textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, textAlign: 'center', lineHeight: 22 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: SPACING.margin,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10
  },
  headerTitle: { ...TYPOGRAPHY.headlineMD, color: COLORS.onSurface },
  scrollContent: { padding: SPACING.margin },
  msgCard: { flexDirection: 'row', padding: 20, backgroundColor: COLORS.surfaceContainer, borderRadius: 16, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  unreadCard: { borderColor: COLORS.primaryContainer, backgroundColor: COLORS.surfaceContainerHigh },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  msgBody: { flex: 1, marginLeft: 15 },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  senderName: { ...TYPOGRAPHY.labelMD, color: '#fff', fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 11, color: COLORS.onSurfaceVariant },
  msgText: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primaryContainer, marginLeft: 10 }
});

export default MessagesScreen;