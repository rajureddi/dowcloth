import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { PRODUCTS } from '../data/products';

export default function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState(PRODUCTS.slice(0, 4));

  const removeItem = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const moveToCart = (item) => {
    Alert.alert('Added to Cart! 🛍️', `${item.name} has been added to your cart.`);
    removeItem(item.id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️  Wishlist</Text>
        <Text style={styles.itemCount}>{wishlist.length} items</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySub}>Save items you love and come back to them later</Text>
          <TouchableOpacity style={styles.exploreBtnWrap} onPress={() => navigation.navigate('Home')}>
            <LinearGradient colors={['#2563EB', '#7C3AED']} style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>Explore Fashion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {wishlist.map(item => (
            <View key={item.id} style={styles.wishCard}>
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                <Image source={item.image} style={styles.wishImage} resizeMode="cover" />
              </TouchableOpacity>
              <View style={styles.wishInfo}>
                <View style={styles.wishTopRow}>
                  <Text style={styles.wishBrand}>{item.brand}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={{ fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.wishName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.wishPriceRow}>
                  <Text style={styles.wishPrice}>₹{item.price.toLocaleString()}</Text>
                  <Text style={styles.wishOriginal}>₹{item.originalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.wishDeliveryRow}>
                  <Text style={styles.wishDelivery}>⚡ {item.deliveryTime}</Text>
                </View>
                <View style={styles.wishActions}>
                  <TouchableOpacity
                    style={styles.wishTryOnBtn}
                    onPress={() => navigation.navigate('VirtualTryOn', { product: item })}
                  >
                    <Text style={styles.wishTryOnText}>✨ Try On</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.wishCartBtn} onPress={() => moveToCart(item)}>
                    <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.wishCartGrad}>
                      <Text style={styles.wishCartText}>Add to Cart</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 90 }} />
        </ScrollView>
      )}
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark },
  itemCount: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxxl },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 28 },
  exploreBtnWrap: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  exploreBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: RADIUS.xl },
  exploreBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  listContent: { padding: SPACING.lg, gap: 16 },
  wishCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.sm, gap: 0,
  },
  wishImage: { width: 120, height: 160, backgroundColor: COLORS.inputBg },
  wishInfo: { flex: 1, padding: SPACING.md, justifyContent: 'space-between' },
  wishTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  wishBrand: { fontSize: 10, color: COLORS.textLight, fontWeight: '600', textTransform: 'uppercase' },
  wishName: { fontSize: 14, fontWeight: '700', color: COLORS.dark, lineHeight: 19, marginBottom: 8 },
  wishPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  wishPrice: { fontSize: 17, fontWeight: '900', color: COLORS.dark },
  wishOriginal: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  wishDeliveryRow: { marginBottom: 10 },
  wishDelivery: { fontSize: 11, color: COLORS.deliveryText, fontWeight: '700' },
  wishActions: { flexDirection: 'row', gap: 8 },
  wishTryOnBtn: {
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: '#EFF6FF',
  },
  wishTryOnText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  wishCartBtn: { flex: 1, borderRadius: RADIUS.md, overflow: 'hidden' },
  wishCartGrad: { paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  wishCartText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
