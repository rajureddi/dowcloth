import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Image, Dimensions, Animated, TextInput,
  StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../utils/theme';
import { PRODUCTS, CATEGORIES, BANNERS, TOP_CATEGORIES } from '../data/products';
import Logo from '../components/Logo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.sm) / 2;
const BANNER_WIDTH = width - SPACING.lg * 2;

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [activeBanner, setActiveBanner] = useState(0);
  const [searchText, setSearchText] = useState('');
  const bannerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const filteredProducts = activeCategory === 'For You'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory || p.subCategory === activeCategory);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderBanner = ({ item, index }) => (
    <LinearGradient colors={item.gradient} style={styles.banner}>
      <View style={styles.bannerTag}>
        <Text style={styles.bannerTagText}>{item.tag}</Text>
      </View>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      <TouchableOpacity style={styles.bannerBtn}>
        <Text style={styles.bannerBtnText}>Shop Now  →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productImageBox}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
        <TouchableOpacity style={styles.wishBtn}>
          <Text style={{ fontSize: 16 }}>🤍</Text>
        </TouchableOpacity>
        {/* Virtual Try On chip */}
        <TouchableOpacity
          style={styles.tryOnChip}
          onPress={() => navigation.navigate('VirtualTryOn', { product: item })}
        >
          <Text style={styles.tryOnChipText}>✨ Try On</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.brandLabel} numberOfLines={1}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item?.price?.toLocaleString() || '0'}</Text>
          <Text style={styles.originalPrice}>₹{item?.originalPrice?.toLocaleString() || '0'}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryText}>⚡ {item.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTopCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.topCatCard}
      onPress={() => navigation.navigate('Category', { title: item.name, filter: item.filter })}
    >
      <View style={styles.topCatIconBox}>
        <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
      </View>
      <Text style={styles.topCatName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Logo size={40} color={COLORS.primary} showText={false} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.logoName}>DowCloth</Text>
            <TouchableOpacity style={styles.locationRow}>
              <Text style={styles.locationText}>📍 Bengaluru, India  ▾</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder='Search "Dresses, Shirts, Hoodies..."'
              placeholderTextColor={COLORS.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={styles.tryBuyBtn}
            onPress={() => navigation.navigate('VirtualTryOn', { product: null })}
          >
            <LinearGradient colors={['#2563EB', '#7C3AED']} style={styles.tryBuyGrad}>
              <Text style={styles.tryBuyText}>✨ TRY</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Delivery Banner */}
        <LinearGradient
          colors={['#EFF6FF', '#EDE9FE']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.deliveryStrip}
        >
          <Text style={styles.deliveryStripText}>⚡ Guaranteed delivery in</Text>
          <Text style={styles.deliveryStripBold}> 60 MINUTES</Text>
          <Text style={styles.deliveryStripText}> — Free above ₹499</Text>
        </LinearGradient>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, activeCategory === cat.name && styles.catPillActive]}
              onPress={() => navigation.navigate('Category', { title: cat.name, filter: cat.name })}
            >
              <Text style={styles.catPillEmoji}>{cat.icon}</Text>
              <Text style={[styles.catPillText, activeCategory === cat.name && styles.catPillTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banners */}
        <View style={styles.bannerSection}>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            renderItem={renderBanner}
            keyExtractor={i => i.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_WIDTH + SPACING.sm}
            decelerationRate="fast"
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + SPACING.sm));
              setActiveBanner(idx);
            }}
            contentContainerStyle={{ gap: SPACING.sm, paddingHorizontal: SPACING.lg }}
          />
          <View style={styles.bannerDots}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeBanner && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TOP CATEGORIES</Text>
          <Text style={styles.sectionSub}>Shop everything at unbelievable prices</Text>
        </View>
        <FlatList
          data={TOP_CATEGORIES}
          renderItem={renderTopCategory}
          keyExtractor={i => i.id}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.topCatGrid}
        />

        {/* Virtual Try-On Banner */}
        <TouchableOpacity
          style={styles.tryOnBanner}
          onPress={() => navigation.navigate('VirtualTryOn', { product: null })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#0F172A', '#1A3A8F', '#2563EB']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.tryOnBannerGrad}
          >
            <View style={styles.tryOnBannerContent}>
              <View>
                <Text style={styles.tryOnBannerTitle}>✨ Virtual Try-On</Text>
                <Text style={styles.tryOnBannerSub}>See how it looks on YOU</Text>
                <Text style={styles.tryOnBannerDesc}>Powered by Google Vertex AI</Text>
              </View>
              <View style={styles.tryOnBannerIconBox}>
                <Text style={{ fontSize: 48 }}>🪄</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'For You' ? '🔥 TRENDING FOR YOU' : `${activeCategory.toUpperCase()}`}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Category', { title: activeCategory, filter: activeCategory })}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={i => i.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productGrid}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  logoName: { fontSize: 18, fontWeight: '800', color: COLORS.dark, letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 11, color: COLORS.textSecondary },
  locationChevron: { fontSize: 10, color: COLORS.primary, fontWeight: '700' },
  profileBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center', justifyContent: 'center',
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 14, height: 44, gap: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  tryBuyBtn: { borderRadius: RADIUS.full, overflow: 'hidden' },
  tryBuyGrad: { paddingHorizontal: 16, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.full },
  tryBuyText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  deliveryStrip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: RADIUS.md, marginBottom: 12,
  },
  deliveryStripText: { fontSize: 12, color: COLORS.textSecondary },
  deliveryStripBold: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  catScroll: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg, marginBottom: 2 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8, marginBottom: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1, borderColor: 'transparent',
  },
  catPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primary,
  },
  catPillEmoji: { fontSize: 14 },
  catPillText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  catPillTextActive: { color: COLORS.primary, fontWeight: '700' },
  scrollContent: { paddingBottom: 100 },
  bannerSection: { marginTop: 16, marginBottom: 8 },
  banner: {
    width: BANNER_WIDTH,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    minHeight: 170,
    justifyContent: 'flex-end',
  },
  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
    marginBottom: 10,
  },
  bannerTagText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  bannerTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2, marginBottom: 14 },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { width: 18, backgroundColor: COLORS.primary },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, marginTop: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.dark, letterSpacing: 0.5 },
  sectionSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  topCatGrid: { paddingHorizontal: SPACING.lg, gap: 12 },
  topCatCard: {
    flex: 1, alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: 14, margin: 4,
    ...SHADOWS.sm,
  },
  topCatIconBox: { marginBottom: 8 },
  topCatName: { fontSize: 11, fontWeight: '600', color: COLORS.dark, textAlign: 'center' },
  tryOnBanner: { marginHorizontal: SPACING.lg, marginTop: 20, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  tryOnBannerGrad: { padding: SPACING.xl },
  tryOnBannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tryOnBannerTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  tryOnBannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  tryOnBannerDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 },
  tryOnBannerIconBox: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  productRow: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.sm },
  productGrid: { paddingBottom: 20 },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  productImageBox: { width: '100%', height: 180, backgroundColor: '#F8F9FF', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  tryOnChip: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(37,99,235,0.9)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  tryOnChipText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  productInfo: { padding: 10 },
  brandLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.dark, lineHeight: 17, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
  originalPrice: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star: { color: COLORS.starColor, fontSize: 12 },
  ratingText: { fontSize: 11, fontWeight: '700', color: COLORS.dark },
  reviewText: { fontSize: 10, color: COLORS.textLight, flex: 1 },
  deliveryBadge: {
    backgroundColor: COLORS.deliveryBadge,
    paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  deliveryText: { fontSize: 9, color: COLORS.deliveryText, fontWeight: '700' },
});
