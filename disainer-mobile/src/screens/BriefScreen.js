import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Camera, Image as ImageIcon, Send, X } from 'lucide-react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

const BriefScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service, pack } = route.params || {};

  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [answers, setAnswers] = useState({});

  const handleSend = () => {
    Alert.alert(
      "¡Brief Recibido!",
      "Hemos capturado tu visión. Un asesor se comunicará con vos en las próximas 24hs para dar inicio formal al proyecto.",
      [{ text: "Entendido", onPress: () => navigation.navigate('Home') }]
    );
  };

  const handleAnswerChange = (question, text) => {
    setAnswers({ ...answers, [question]: text });
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.text}>Necesitamos permiso para la cámara</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePhoto = async (camera) => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhotos([...photos, photo.uri]);
      setShowCamera(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  if (showCamera) {
    let cameraRef;
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={(ref) => cameraRef = ref}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCamera(false)}>
              <X color="white" size={32} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureBtn} onPress={() => takePhoto(cameraRef)}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Brief del Proyecto</Text>
            <TouchableOpacity 
              onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <X color={COLORS.onSurface} size={24} />
            </TouchableOpacity>
          </View>
          
          {service && (
            <View style={styles.serviceBadge}>
              <Text style={styles.serviceBadgeText}>{service.title} - {pack.name}</Text>
            </View>
          )}

          <Text style={styles.subtitle}>
            {service 
              ? 'Completá esta información para que podamos empezar a trabajar.' 
              : 'Contanos tu visión arquitectónica en Zárate.'}
          </Text>

          {service?.questionnaire ? (
            <View style={styles.questionnaireContainer}>
              {service.questionnaire.map((q, i) => (
                <View key={i} style={styles.questionItem}>
                  <Text style={styles.questionText}>{q}</Text>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="Tu respuesta..."
                    placeholderTextColor={COLORS.onSurfaceVariant}
                    value={answers[q] || ''}
                    onChangeText={(text) => handleAnswerChange(q, text)}
                  />
                </View>
              ))}
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Descripción General</Text>
          <TextInput
            style={styles.input}
            placeholder="Algo más que debamos saber..."
            placeholderTextColor={COLORS.onSurfaceVariant}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.sectionTitle}>Referencias Visuales</Text>
          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.addPhotoBtn} onPress={() => setShowCamera(true)}>
              <Camera color={COLORS.primaryContainer} size={24} />
              <Text style={styles.addPhotoText}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <ImageIcon color={COLORS.primaryContainer} size={24} />
              <Text style={styles.addPhotoText}>Galería</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photoGrid}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removePhoto} 
                  onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                >
                  <X color="white" size={14} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send color={COLORS.onPrimary} size={20} style={{ marginRight: 8 }} />
            <Text style={styles.sendButtonText}>Enviar Brief</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.margin },
  title: { ...TYPOGRAPHY.headlineLG, color: COLORS.onSurface },
  subtitle: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurfaceVariant, marginBottom: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  text: { ...TYPOGRAPHY.bodyMD, color: COLORS.onSurface, textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    color: COLORS.onSurface,
    ...TYPOGRAPHY.bodyMD,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface, marginTop: 32, marginBottom: 12 },
  photoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  addPhotoBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.outlineVariant,
  },
  addPhotoText: { ...TYPOGRAPHY.labelSM, color: COLORS.onSurfaceVariant, marginTop: 4 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoWrapper: { position: 'relative' },
  previewImage: { width: 100, height: 100, borderRadius: 12 },
  removePhoto: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    padding: 2,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryContainer,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  sendButtonText: { ...TYPOGRAPHY.labelMD, color: COLORS.onPrimary, fontWeight: 'bold' },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0
  },
  serviceBadge: {
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  serviceBadgeText: { ...TYPOGRAPHY.labelSM, color: COLORS.onPrimary, fontWeight: 'bold' },
  questionnaireContainer: { gap: 20, marginBottom: 32 },
  questionItem: { gap: 8 },
  questionText: { ...TYPOGRAPHY.labelMD, color: COLORS.onSurface },
  smallInput: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    color: COLORS.onSurface,
    ...TYPOGRAPHY.bodyMD,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  primaryButton: { backgroundColor: COLORS.primaryContainer, padding: 16, borderRadius: 12 },
  primaryButtonText: { color: COLORS.onPrimary, fontWeight: 'bold' },
});

export default BriefScreen;
