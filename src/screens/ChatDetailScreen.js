import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { ChevronLeft, Send, MessageCircle } from 'lucide-react-native';

const ChatDetailScreen = ({ route, navigation }) => {
  const { chat } = route.params || { chat: { sender: 'Equipo Disainer', id: '1' } };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola! Bienvenido al canal de soporte oficial de Disainer.', sender: 'system', time: '10:00 AM' },
    { id: '2', text: 'Hemos recibido tu pedido y ya estamos trabajando en los primeros bocetos.', sender: chat.sender, time: '10:30 AM' },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ChevronLeft color={COLORS.onSurface} size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{chat.sender}</Text>
          <Text style={styles.headerStatus}>En línea</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageBubble, 
              msg.sender === 'me' ? styles.myMessage : styles.theirMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'me' ? styles.myMessageText : styles.theirMessageText
            ]}>
              {msg.text}
            </Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]} 
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send color="#000" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: SPACING.margin,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10
  },
  headerInfo: { alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.labelMD, color: '#fff', fontWeight: 'bold' },
  headerStatus: { fontSize: 10, color: COLORS.primaryFixedDim },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { 
    maxWidth: '80%', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 15,
    position: 'relative'
  },
  myMessage: { 
    alignSelf: 'flex-end', 
    backgroundColor: COLORS.primaryContainer,
    borderBottomRightRadius: 4
  },
  theirMessage: { 
    alignSelf: 'flex-start', 
    backgroundColor: COLORS.surfaceContainer,
    borderBottomLeftRadius: 4
  },
  messageText: { ...TYPOGRAPHY.bodyMD },
  myMessageText: { color: '#000' },
  theirMessageText: { color: '#fff' },
  messageTime: { 
    fontSize: 9, 
    color: 'rgba(255,255,255,0.4)', 
    marginTop: 4, 
    textAlign: 'right' 
  },
  inputArea: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15
  },
  input: { 
    flex: 1, 
    backgroundColor: COLORS.surfaceContainer, 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    color: '#fff',
    maxHeight: 100,
    ...TYPOGRAPHY.bodyMD
  },
  sendBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: COLORS.primaryContainer, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10
  }
});

export default ChatDetailScreen;
