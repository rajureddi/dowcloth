import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
  StatusBar, Image,
} from 'react-native';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Elegant branding entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 1000, 
          useNativeDriver: true 
        }),
        Animated.spring(scaleAnim, { 
          toValue: 1, 
          friction: 8, 
          tension: 20, 
          useNativeDriver: true 
        }),
      ]),
      Animated.timing(slideAnim, { 
        toValue: 0, 
        duration: 500, 
        useNativeDriver: true 
      }),
    ]).start();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { 
        toValue: 0, 
        duration: 400, 
        useNativeDriver: true 
      }).start(() => {
        navigation.replace('Main');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Main Logo */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineBox, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.tagline}>India's First Instant Fashion Platform</Text>
          <View style={styles.highlight} />
        </Animated.View>
      </Animated.View>

      {/* Version/Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BENGALURU • HYDERABAD • MUMBAI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', // High-end clean white
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  content: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  logo: { 
    width: width * 0.5, 
    height: width * 0.5, 
  },
  taglineBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  highlight: {
    height: 3,
    width: 60,
    backgroundColor: '#2563EB',
    marginTop: 8,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 2,
    fontWeight: '600',
  },
});
