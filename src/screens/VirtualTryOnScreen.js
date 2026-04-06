import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, Dimensions, Platform, StatusBar, Alert,
  ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { performVirtualTryOn } from '../services/vertexAI';

import { PRODUCTS, CATEGORIES } from '../data/products';

const { width, height } = Dimensions.get('window');

const STEPS = ['Guide', 'Upload Photo', 'Try On', 'Result'];

export default function VirtualTryOnScreen({ route, navigation }) {
  const { product: initialProduct } = route.params || {};
  
  // ALWAYS fetch fresh from the master list to ensure correct mapping
  const product = PRODUCTS.find(p => p.id === initialProduct?.id) || initialProduct;
  
  const [step, setStep] = useState(0); 
  const [personImageUri, setPersonImageUri] = useState(null);
  const [resultImageUri, setResultImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Log for verification
  console.log('✨ SYNC CHECK: Displaying product ID:', product?.id, 'Name:', product?.name);

  const fadeTransition = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow gallery access in your settings to upload photos.');
        return;
      }

      console.log('📸 Opening Gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('✅ Image Picked:', result.assets[0].uri);
        setPersonImageUri(result.assets[0].uri);
      } else {
        console.log('⚠️ Selection Cancelled');
      }
    } catch (error) {
      console.log('❌ GALLERY ERROR:', error);
      Alert.alert('Gallery Error', 'Could not open photo library.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera access is required to take a new photo.');
        return;
      }

      console.log('📸 Opening Camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('✅ Photo Taken:', result.assets[0].uri);
        setPersonImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('❌ CAMERA ERROR:', error);
      Alert.alert('Camera Error', 'Could not open camera.');
    }
  };

  const getGarmentUri = async () => {
    if (!product) return null;
    const asset = Asset.fromModule(product.clothImage);
    await asset.downloadAsync();
    return asset.localUri;
  };

  const runTryOn = async () => {
    if (!personImageUri) {
      Alert.alert('No Photo', 'Please upload a photo first.');
      return;
    }
    if (!product) {
      Alert.alert('No Garment', 'Please select a product to try on.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    fadeTransition(() => setStep(2));

    try {
      const garmentUri = await getGarmentUri();
      if (!garmentUri) throw new Error('Could not load garment image');

      // 🔥 CATEGORY MAPPING: Helps the AI lock on to your selected garment
      let category = 'upper body';
      const subCat = product?.subCategory?.toLowerCase() || '';
      const mainCat = product?.category?.toLowerCase() || '';
      
      if (subCat.includes('dress') || subCat.includes('saree') || subCat.includes('ethnic') || mainCat.includes('ethnic')) {
        category = 'one piece';
      } else if (subCat.includes('pant') || subCat.includes('jeans') || subCat.includes('lower') || subCat.includes('trouser')) {
        category = 'lower body';
      }

      console.log('✨ Model Input - Category:', category);
      const result = await performVirtualTryOn(personImageUri, garmentUri, category);

      if (result.success) {
        setResultImageUri(result.imageUri);
        fadeTransition(() => setStep(3));
      } else {
        setErrorMsg(result.error);
        Alert.alert(
          'Try-On Failed',
          `API Error: ${result.error}\n\nThis may be due to API quota or permissions.`,
          [{ text: 'OK' }]
        );
        fadeTransition(() => setStep(1));
      }
    } catch (e) {
      setErrorMsg(e.message);
      Alert.alert('Error', e.message);
      fadeTransition(() => setStep(1));
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigation.navigate('Checkout', { product, size: product?.sizes[0], quantity: 1 });
  };

  // STEP 0: Guide
  const renderGuide = () => (
    <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.guideHeroCard}>
        <Text style={styles.guideHeroTitle}>Virtual Try-On</Text>
        <Text style={styles.guideHeroSub}>See exactly how the garment looks on you before buying!</Text>
        <View style={styles.guideDemoRow}>
          {['Stand\nStraight', 'Full\nBody', 'Gallery\nPhoto'].map((label, i) => (
            <View key={i} style={styles.guideStep}>
              <View style={styles.guideStepIconBox}>
                <Text style={{ fontSize: 32 }}>{['🧍', '📐', '🖼️'][i]}</Text>
              </View>
              <Text style={styles.guideStepNum}>{i + 1}.</Text>
              <Text style={styles.guideStepLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {[
        { icon: '🧍', title: 'Stand Straight', desc: 'Face the camera directly for best results.' },
        { icon: '📏', title: 'Position Yourself in Frame', desc: 'Make sure your full body fits inside the frame.' },
        { icon: '👗', title: 'Wear Fitted Clothes', desc: 'Lighter, fitted clothes give more accurate results.' },
      ].map((item, i) => (
        <View key={i} style={styles.guideInfoCard}>
          <Text style={styles.guideInfoIcon}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.guideInfoTitle}>{item.title}</Text>
            <Text style={styles.guideInfoDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}

      {/* Garment Preview */}
      {product && (
        <View style={styles.selectedGarmentCard}>
          <Text style={styles.selectedGarmentLabel}>Selected Garment</Text>
          <View style={styles.selectedGarmentRow}>
            <Image source={product.clothImage} style={styles.garmentThumb} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={styles.garmentName}>{product?.name}</Text>
              <Text style={styles.garmentBrand}>{product?.brand}</Text>
              <Text style={styles.garmentPrice}>₹{product?.price?.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          ⚠️ AI results may not always be 100% accurate. Avoid uploading inappropriate images.
        </Text>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={() => fadeTransition(() => setStep(1))}>
        <LinearGradient
          colors={['#2563EB', '#7C3AED']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.startBtnGrad}
        >
          <Text style={styles.startBtnText}>Get Started  →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // STEP 1: Upload Photo
  const renderUpload = () => (
    <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Upload Your Photo</Text>
      <Text style={styles.stepSubtitle}>Take a full-body photo or choose from gallery</Text>

      {personImageUri ? (
        <View style={styles.previewBox}>
          <Image 
            key={personImageUri}
            source={{ uri: personImageUri }} 
            style={styles.previewImage} 
            resizeMode="cover" 
          />
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setPersonImageUri(null)}>
              <Text style={styles.retakeBtnText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.uploadzone}>
          <Text style={styles.uploadZoneEmoji}>📸</Text>
          <Text style={styles.uploadZoneText}>No photo selected yet</Text>
          <Text style={styles.uploadZoneSub}>Choose from gallery or take a new photo</Text>
        </View>
      )}

      <View style={styles.uploadBtnsRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickFromGallery}>
          <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.uploadBtnGrad}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🖼️</Text>
            <Text style={styles.uploadBtnText}>Gallery</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
          <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.uploadBtnGrad}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>📷</Text>
            <Text style={styles.uploadBtnText}>Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Garment preview */}
      {product && (
        <View style={styles.garmentPreviewSection}>
          <Text style={styles.garmentPreviewLabel}>Garment to try:</Text>
          <View style={styles.garmentPreviewRow}>
            <Image source={product?.clothImage} style={styles.garmentPreviewImg} resizeMode="contain" />
            <View>
              <Text style={styles.garmentPreviewName}>{product?.name}</Text>
              <Text style={styles.garmentPreviewPrice}>₹{product?.price?.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}

      {personImageUri && (
        <TouchableOpacity style={styles.tryNowBtn} onPress={runTryOn} activeOpacity={0.85}>
          <LinearGradient
            colors={['#2563EB', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.tryNowGrad}
          >
            <Text style={styles.tryNowText}>✨  Try It On Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  // STEP 2: Processing
  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <LinearGradient colors={['#0A0E27', '#1A3A8F']} style={styles.processingGrad}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.processingIconBox}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
          <Text style={styles.processingTitle}>AI Magic Happening...</Text>
          <Text style={styles.processingSubtitle}>
            Google Vertex AI is generating your try-on
          </Text>

          <View style={styles.processingSteps}>
            {['Analyzing your photo...', 'Mapping body contours...', 'Applying garment texture...', 'Rendering final image...'].map((s, i) => (
              <View key={i} style={styles.processingStepRow}>
                <View style={styles.processingDot} />
                <Text style={styles.processingStepText}>{s}</Text>
              </View>
            ))}
          </View>

          {personImageUri && (
            <Image source={{ uri: personImageUri }} style={styles.processingPersonImg} resizeMode="contain" />
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );

  // STEP 3: Result
  const renderResult = () => (
    <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>✨ Your Try-On Result</Text>
        <Text style={styles.resultSub}>Powered by Google Vertex AI</Text>
      </View>

      {resultImageUri && (
        <View style={styles.resultImageCard}>
          <Image source={{ uri: resultImageUri }} style={styles.resultImage} resizeMode="contain" />
          <LinearGradient
            colors={['transparent', 'rgba(37,99,235,0.1)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.resultBadge}>
            <Text style={styles.resultBadgeText}>✨ AI Generated</Text>
          </View>
        </View>
      )}

      {/* Product info below result */}
      {product && (
        <View style={styles.resultProductCard}>
          <Image source={product.image} style={styles.resultProductImg} resizeMode="cover" />
          <View style={styles.resultProductInfo}>
            <Text style={styles.resultProductName}>{product.name}</Text>
            <Text style={styles.resultProductBrand}>{product.brand}</Text>
            <View style={styles.resultPriceRow}>
              <Text style={styles.resultPrice}>₹{product.price.toLocaleString()}</Text>
              <Text style={styles.resultOriginal}>₹{product.originalPrice.toLocaleString()}</Text>
              <View style={styles.resultSaveBadge}>
                <Text style={styles.resultSaveText}>{product.discount}% OFF</Text>
              </View>
            </View>
            <View style={styles.resultDelivery}>
              <Text style={styles.resultDeliveryText}>⚡ {product.deliveryTime}</Text>
            </View>

            {/* Size selector in result */}
            <Text style={styles.resultSizeLabel}>Pick a size:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.sizes.map(sz => (
                <TouchableOpacity key={sz} style={styles.resultSizeBtn}>
                  <Text style={styles.resultSizeBtnText}>{sz}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fadeTransition(() => setStep(0))}>
          <Text style={styles.retryBtnText}>↩  Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.buyNowGrad}
          >
            <Text style={styles.buyNowText}>Buy Now  ⚡</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.shareResultBtn}>
        <Text style={styles.shareResultText}>📤  Share Your Look</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual Try-On</Text>
        <View style={styles.aiChip}>
          <Text style={styles.aiChipText}>✨ AI</Text>
        </View>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {STEPS.map((s, i) => (
          <View key={i} style={styles.stepIndicatorItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              <Text style={[styles.stepDotText, i <= step && styles.stepDotTextActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepConnector, i < step && styles.stepConnectorActive]} />
            )}
          </View>
        ))}
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {step === 0 && renderGuide()}
        {step === 1 && renderUpload()}
        {step === 2 && renderProcessing()}
        {step === 3 && renderResult()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 52,
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerBackBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  headerBackIcon: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark },
  aiChip: {
    backgroundColor: COLORS.tagBg, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  aiChipText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white, gap: 4,
  },
  stepIndicatorItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.inputBg, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepDotText: { fontSize: 11, fontWeight: '700', color: COLORS.textLight },
  stepDotTextActive: { color: '#FFF' },
  stepLabel: {
    fontSize: 10, color: COLORS.textLight, fontWeight: '500',
    marginLeft: 4, marginRight: 4,
  },
  stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
  stepConnector: { width: 18, height: 2, backgroundColor: COLORS.border, marginHorizontal: 2 },
  stepConnectorActive: { backgroundColor: COLORS.primary },
  content: { flex: 1 },
  stepContent: { padding: SPACING.lg, paddingBottom: 40 },
  // Guide
  guideHeroCard: {
    backgroundColor: COLORS.dark, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginBottom: 16,
  },
  guideHeroTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 6 },
  guideHeroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 20 },
  guideDemoRow: { flexDirection: 'row', justifyContent: 'space-around' },
  guideStep: { alignItems: 'center', flex: 1 },
  guideStepIconBox: {
    width: 64, height: 80, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  guideStepNum: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  guideStepLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' },
  guideInfoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: 10, ...SHADOWS.sm,
  },
  guideInfoIcon: { fontSize: 24 },
  guideInfoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dark, marginBottom: 3 },
  guideInfoDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  selectedGarmentCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: 10, ...SHADOWS.sm,
  },
  selectedGarmentLabel: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  selectedGarmentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  garmentThumb: { width: 64, height: 80, borderRadius: RADIUS.md, backgroundColor: COLORS.inputBg },
  garmentName: { fontSize: 14, fontWeight: '700', color: COLORS.dark, marginBottom: 3 },
  garmentBrand: { fontSize: 11, color: COLORS.textLight, marginBottom: 5 },
  garmentPrice: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  disclaimerBox: {
    backgroundColor: '#FFFBEB', borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#F59E0B',
  },
  disclaimerText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  startBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  startBtnGrad: { height: 54, alignItems: 'center', justifyContent: 'center' },
  startBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  // Upload
  stepTitle: { fontSize: 22, fontWeight: '900', color: COLORS.dark, marginBottom: 6, textAlign: 'center' },
  stepSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, textAlign: 'center' },
  uploadzone: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    padding: 40, marginBottom: 20,
  },
  uploadZoneEmoji: { fontSize: 44, marginBottom: 12 },
  uploadZoneText: { fontSize: 16, fontWeight: '700', color: COLORS.dark, marginBottom: 6 },
  uploadZoneSub: { fontSize: 13, color: COLORS.textLight, textAlign: 'center' },
  previewBox: { marginBottom: 16, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.sm },
  previewImage: { width: width - SPACING.lg * 2, height: height * 0.4, backgroundColor: COLORS.inputBg },
  previewActions: { backgroundColor: COLORS.white, padding: SPACING.md, alignItems: 'flex-end' },
  retakeBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full,
  },
  retakeBtnText: { color: COLORS.textSecondary, fontSize: 13 },
  uploadBtnsRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  uploadBtn: { flex: 1, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.sm },
  uploadBtnGrad: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  uploadBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.dark },
  garmentPreviewSection: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: 20, ...SHADOWS.sm,
  },
  garmentPreviewLabel: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  garmentPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  garmentPreviewImg: { width: 72, height: 90, borderRadius: RADIUS.md, backgroundColor: COLORS.inputBg },
  garmentPreviewName: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  garmentPreviewPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  tryNowBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  tryNowGrad: { height: 56, alignItems: 'center', justifyContent: 'center' },
  tryNowText: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  // Processing
  processingContainer: { flex: 1 },
  processingGrad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxxl },
  processingIconBox: { marginBottom: 24, padding: 20 },
  processingTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  processingSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  processingSteps: { gap: 12, marginBottom: 32 },
  processingStepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  processingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primaryLight },
  processingStepText: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  processingPersonImg: {
    width: 120, height: 160, borderRadius: RADIUS.lg,
    alignSelf: 'center', opacity: 0.6,
  },
  // Result
  resultHeader: { alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 22, fontWeight: '900', color: COLORS.dark },
  resultSub: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  resultImageCard: {
    width: '100%', height: height * 0.45,
    borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: 16, ...SHADOWS.lg,
    backgroundColor: COLORS.inputBg,
  },
  resultImage: { width: '100%', height: '100%' },
  resultBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(37,99,235,0.9)', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  resultBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  resultProductCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: 16, flexDirection: 'row', gap: 12, ...SHADOWS.sm,
  },
  resultProductImg: { width: 80, height: 100, borderRadius: RADIUS.md },
  resultProductInfo: { flex: 1 },
  resultProductName: { fontSize: 15, fontWeight: '800', color: COLORS.dark, marginBottom: 3 },
  resultProductBrand: { fontSize: 11, color: COLORS.textLight, marginBottom: 8 },
  resultPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  resultPrice: { fontSize: 18, fontWeight: '900', color: COLORS.dark },
  resultOriginal: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  resultSaveBadge: { backgroundColor: '#DCFCE7', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  resultSaveText: { color: '#16A34A', fontSize: 10, fontWeight: '700' },
  resultDelivery: { backgroundColor: '#EFF6FF', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  resultDeliveryText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  resultSizeLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  resultSizeBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.primary,
    marginRight: 8, backgroundColor: '#EFF6FF',
  },
  resultSizeBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  resultActions: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  retryBtn: {
    flex: 1, height: 52, borderRadius: RADIUS.xl,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  retryBtnText: { color: COLORS.dark, fontWeight: '700', fontSize: 14 },
  buyNowBtn: { flex: 1, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  buyNowGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buyNowText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  shareResultBtn: {
    height: 48, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  shareResultText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
});
