import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Platform, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart.');
      return;
    }
    Alert.alert('Added to Cart! 🛍️', `${product.name} (${selectedSize}) added to your cart.`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before buying.');
      return;
    }
    navigation.navigate('Checkout', { product, size: selectedSize, quantity });
  };

  const handleVirtualTryOn = () => {
    navigation.navigate('VirtualTryOn', { product });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Back Button */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ fontSize: 18 }}>⎌</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.mainImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.05)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity style={styles.wishBtn} onPress={() => setWishlist(!wishlist)}>
            <Text style={{ fontSize: 22 }}>{wishlist ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          {/* Delivery badge on image */}
          <View style={styles.imageDeliveryBadge}>
            <Text style={styles.imageDeliveryText}>⚡ {product.deliveryTime}</Text>
          </View>
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          {/* Brand & Name */}
          <View style={styles.brandRow}>
            <View style={styles.brandChip}>
              <Text style={styles.brandChipText}>{product.brand}</Text>
            </View>
            <View style={styles.ratingChip}>
              <Text style={styles.starText}>★ {product.rating}</Text>
              <Text style={styles.reviewCount}>  ({product.reviews})</Text>
            </View>
          </View>
          <Text style={styles.productName}>{product?.name}</Text>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>₹{product?.price?.toLocaleString()}</Text>
            <Text style={styles.originalPrice}>₹{product?.originalPrice?.toLocaleString()}</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save {product?.discount}%</Text>
            </View>
          </View>
          <Text style={styles.taxNote}>Inclusive of all taxes</Text>

          {/* Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow}>
            {product.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </ScrollView>

          {/* ✨ VIRTUAL TRY-ON BUTTON */}
          <TouchableOpacity
            style={styles.tryOnBtn}
            onPress={handleVirtualTryOn}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#2563EB', '#7C3AED']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.tryOnGradient}
            >
              <Text style={styles.tryOnBtnEmoji}>✨</Text>
              <View>
                <Text style={styles.tryOnBtnTitle}>Virtual Try-On</Text>
                <Text style={styles.tryOnBtnSub}>See how it looks on you — powered by AI</Text>
              </View>
              <Text style={styles.tryOnArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Colors */}
          <Text style={styles.sectionLabel}>Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorsRow}>
            {product.colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorChip, selectedColor === color && styles.colorChipActive]}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={[styles.colorChipText, selectedColor === color && styles.colorChipTextActive]}>
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sizes */}
          <View style={styles.sizeHeader}>
            <Text style={styles.sectionLabel}>Size</Text>
            <TouchableOpacity>
              <Text style={styles.sizeGuide}>Size Guide →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sizesGrid}>
            {product.sizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryIcon}>⚡</Text>
              <View>
                <Text style={styles.deliveryLabel}>Express Delivery</Text>
                <Text style={styles.deliveryValue}>In {product.deliveryTime} to your door</Text>
              </View>
            </View>
            <View style={styles.deliveryDivider} />
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryIcon}>↩️</Text>
              <View>
                <Text style={styles.deliveryLabel}>Easy Returns</Text>
                <Text style={styles.deliveryValue}>15-day hassle-free return</Text>
              </View>
            </View>
            <View style={styles.deliveryDivider} />
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryIcon}>🔒</Text>
              <View>
                <Text style={styles.deliveryLabel}>Secure Payment</Text>
                <Text style={styles.deliveryValue}>100% safe checkout</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Spacer for bottom buttons */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>🛒  Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow} activeOpacity={0.85}>
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.buyGrad}
          >
            <Text style={styles.buyBtnText}>Buy Now ⚡</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 52,
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backIcon: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
  shareBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  imageContainer: { width, height: 420, position: 'relative' },
  mainImage: { width: '100%', height: '100%', backgroundColor: '#F0F4FF' },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  wishBtn: {
    position: 'absolute', right: 16, bottom: 16,
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.md,
  },
  imageDeliveryBadge: {
    position: 'absolute', left: 16, bottom: 16,
    backgroundColor: '#059669', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  imageDeliveryText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  infoCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -20, padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  brandChip: {
    backgroundColor: COLORS.tagBg, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  brandChipText: { color: COLORS.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  ratingChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEB', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  starText: { color: '#B45309', fontSize: 13, fontWeight: '800' },
  reviewCount: { color: COLORS.textLight, fontSize: 11 },
  productName: { fontSize: 20, fontWeight: '800', color: COLORS.dark, marginBottom: 12, lineHeight: 26 },
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  price: { fontSize: 26, fontWeight: '900', color: COLORS.dark },
  originalPrice: { fontSize: 16, color: COLORS.textLight, textDecorationLine: 'line-through' },
  saveBadge: { backgroundColor: '#DCFCE7', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  saveText: { color: '#16A34A', fontSize: 11, fontWeight: '800' },
  taxNote: { fontSize: 11, color: COLORS.textLight, marginBottom: 14 },
  tagsRow: { marginBottom: 18 },
  tag: {
    backgroundColor: COLORS.tagBg, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5, marginRight: 8,
  },
  tagText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  tryOnBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: 20, ...SHADOWS.md },
  tryOnGradient: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
  },
  tryOnBtnEmoji: { fontSize: 28 },
  tryOnBtnTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  tryOnBtnSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  tryOnArrow: { marginLeft: 'auto', color: '#FFF', fontSize: 20, fontWeight: '700' },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: COLORS.dark, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  colorsRow: { marginBottom: 18 },
  colorChip: {
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderRadius: RADIUS.full, backgroundColor: COLORS.inputBg,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  colorChipActive: { borderColor: COLORS.primary, backgroundColor: '#EFF6FF' },
  colorChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  colorChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  sizeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sizeGuide: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  sizesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  sizeBtn: {
    minWidth: 50, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.inputBg,
  },
  sizeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  sizeBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  sizeBtnTextActive: { color: '#FFF' },
  deliveryCard: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: 20, gap: 12,
  },
  deliveryItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  deliveryIcon: { fontSize: 20, marginTop: 2 },
  deliveryLabel: { fontSize: 13, fontWeight: '700', color: COLORS.dark },
  deliveryValue: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  deliveryDivider: { height: 1, backgroundColor: COLORS.border },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, padding: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'android' ? SPACING.lg : 30,
    ...SHADOWS.lg,
  },
  cartBtn: {
    flex: 1, height: 52, borderRadius: RADIUS.xl,
    borderWidth: 2, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 15 },
  buyBtn: { flex: 1, borderRadius: RADIUS.xl, overflow: 'hidden' },
  buyGrad: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.xl },
  buyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
