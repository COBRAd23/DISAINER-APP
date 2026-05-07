import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500, // 2.5 segundos de carga
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 500); // Pequeña pausa al final
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground 
      source={require('../../assets/images/splashscreem.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.loaderContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loaderContainer: {
    width: '100%',
    paddingHorizontal: 80,
    marginBottom: 100,
  },
  progressBarBackground: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryContainer, // El amarillo de tu marca
  },
});

export default SplashScreen;
