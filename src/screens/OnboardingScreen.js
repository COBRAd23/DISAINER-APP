import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Mail } from 'lucide-react-native';
import { auth, rtdb } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const WEB_CLIENT_ID = '622102470878-2hlejbsjp9mc4kp9cqjelfqdghccr13c.apps.googleusercontent.com';


const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'ELEGÍ TU SERVICIO',
    image: require('../../assets/images/onboarding1.webp'),
  },
  {
    id: '2',
    title: 'CONTAME TU HISTORIA',
    image: require('../../assets/images/onboarding2.webp'),
  },
  {
    id: '3',
    title: 'DISFRUTÁ EL RESULTADO',
    image: require('../../assets/images/onboarding3.webp'),
  },
  {
    id: '4',
    title: '', // Final login screen
    image: require('../../assets/images/onboarding3.webp'), // Use same or specific background
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const flatListRef = useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < SLIDES.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    const lastSlideIndex = SLIDES.length - 1;
    const offset = lastSlideIndex * width;
    flatListRef?.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const renderSlide = ({ item }) => (
    <ImageBackground source={item.image} style={styles.slideImage}>
      <View style={styles.overlay}>
        {item.title ? <Text style={styles.slideTitle}>{item.title}</Text> : null}
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        data={SLIDES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
      />

      {/* Footer with Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlideIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Buttons Overlay */}
        {currentSlideIndex < SLIDES.length - 1 ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={skip}>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginCardContainer}>
             {/* Branding on Login Slide */}
            <View style={styles.brandingHeader}>
               <Image 
                 source={require('../../assets/images/disainerlogo.png')} 
                 style={styles.logo} 
                 resizeMode="contain" 
               />
               <Text style={styles.tagline}>Diseñar es decidir. Lo demás sobra.</Text>
            </View>

            {/* Login Card */}
            <View style={styles.loginCard}>
              <Text style={styles.cardTitle}>Bienvenido de Nuevo</Text>
              
              <TouchableOpacity 
                style={[styles.socialButton, loadingGoogle && { opacity: 0.6 }]} 
                disabled={loadingGoogle}
                onPress={async () => {
                  try {
                    setLoadingGoogle(true);
                    const userCredential = await signInAnonymously(auth);
                    const user = userCredential.user;
                    await set(ref(rtdb, `users/${user.uid}`), {
                      name: 'Agustín Disainer',
                      email: 'agustin.disainer@gmail.com',
                      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                      provider: 'google',
                      createdAt: new Date().toISOString()
                    });
                  } catch (error) {
                    console.error('Error:', error);
                  } finally {
                    setLoadingGoogle(false);
                  }
                }}
              >
                {loadingGoogle
                  ? <ActivityIndicator color="#000" size="small" />
                  : <Text style={styles.socialButtonText}>Continuar con Google</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={styles.emailButton} onPress={() => navigation.navigate('Login')}>
                <Mail color={COLORS.onPrimary} size={18} style={{ marginRight: 8 }} />
                <Text style={styles.emailButtonText}>Continuar con Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createAccount} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.createAccountText}>Crear una Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  slideImage: { width, height, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 250,
  },
  slideTitle: {
    ...TYPOGRAPHY.labelMD,
    color: '#fff',
    letterSpacing: 2,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    height: 4,
    width: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  activeDot: {
    backgroundColor: COLORS.primaryContainer,
    width: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  skipText: {
    color: '#fff',
    ...TYPOGRAPHY.labelSM,
    letterSpacing: 1,
  },
  nextButton: {
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 4,
  },
  nextButtonText: {
    color: '#000',
    ...TYPOGRAPHY.labelSM,
    fontWeight: 'bold',
  },
  loginCardContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: -height * 0.7, // Position it over the last slide
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 280,
    height: 80,
    marginBottom: 10,
  },
  tagline: {
    ...TYPOGRAPHY.taglineMD,
    color: COLORS.primaryContainer,
    paddingHorizontal: 40,
  },
  loginCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    width: '100%',
    borderRadius: 12,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    color: '#fff',
    ...TYPOGRAPHY.headlineMD,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    ...TYPOGRAPHY.labelMD,
    fontSize: 14,
  },
  emailButton: {
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emailButtonText: {
    color: '#000',
    ...TYPOGRAPHY.labelMD,
    fontSize: 14,
    fontWeight: 'bold',
  },
  createAccount: {
    alignItems: 'center',
  },
  createAccountText: {
    color: COLORS.primaryFixedDim,
    ...TYPOGRAPHY.labelSM,
    textDecorationLine: 'underline',
  }
});

export default OnboardingScreen;
