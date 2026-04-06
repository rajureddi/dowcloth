import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { PRODUCTS } from '../data/products';

export default function DiscoverScreen({ navigation }) {
  const trending = PRODUCTS.filter(p => p.tags.includes('trending'));
  const newArrivals = PRODUCTS.slice(-6);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍  Discover</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Virtual Try-On Spotlight */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('VirtualTryOn', { product: PRODUCTS[0] })}
        >
          <LinearGradient
            colors={['#0F172A', '#1E3A5F', '#2563EB']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.spotlightCard}
          >
            <View style={styles.spotlightBadge}>
              <Text style={styles.spotlightBadgeText}>✨ AI POWERED</Text>
            </View>
            <Text style={styles.spotlightTitle}>Virtual Try-On</Text>
            <Text style={styles.spotlightSub}>
              Upload your photo and see exactly how any outfit looks on you — before you buy.
            </Text>
            <View style={styles.spotlightFeatures}>
              {['📸 Upload Photo', '🪄 AI Magic', '🛒 Buy Instantly'].map((f, i) => (
                <View key={i} style={styles.spotlightFeatureChip}>
                  <Text style={styles.spotlightFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.spotlightBtn}
              onPress={() => navigation.navigate('VirtualTryOn', { product: PRODUCTS[0] })}>
              <Text style={styles.spotlightBtnText}>Try It Now  →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Trending */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {trending.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.hCard}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Image source={item.image} style={styles.hCardImage} resizeMode="cover" />
              <View style={styles.hDiscountBadge}>
                <Text style={styles.hDiscountText}>{item.discount}%</Text>
              </View>
              <View style={styles.hCardInfo}>
                <Text style={styles.hCardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.hCardPrice}>₹{item.price.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Arrivals */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>🆕 New Arrivals</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {newArrivals.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.hCard}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Image source={item.image} style={styles.hCardImage} resizeMode="cover" />
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
              <View style={styles.hCardInfo}>
                <Text style={styles.hCardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.hCardPrice}>₹{item.price.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Brands */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>🏷️ Popular Brands</Text>
        </View>
        <View style={styles.brandsGrid}>
          {['DowCloth Originals', 'DowCloth Elite', 'DowCloth Heritage', 'DowCloth Urban', 'DowCloth Studio', 'DowCloth Denim'].map((b, i) => (
            <View key={i} style={styles.brandChip}>
              <Text style={styles.brandChipText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* 60 Min Promise */}
        <LinearGradient colors={['#059669', '#047857']} style={styles.promiseCard}>
          <Text style={styles.promiseEmoji}>⚡</Text>
          <Text style={styles.promiseTitle}>60-Minute Delivery Promise</Text>
          <Text style={styles.promiseSub}>Order now and receive your fashion before you know it. Free delivery on orders above ₹499.</Text>
        </LinearGradient>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 52,
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  spotlightCard: { borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: 24 },
  spotlightBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12,
  },
  spotlightBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  spotlightTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', marginBottom: 8 },
  spotlightSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  spotlightFeatures: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  spotlightFeatureChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6,
  },
  spotlightFeatureText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  spotlightBtn: {
    alignSelf: 'flex-start', backgroundColor: '#FFF',
    borderRadius: RADIUS.full, paddingHorizontal: 20, paddingVertical: 10,
  },
  spotlightBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.dark },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  hScroll: { marginHorizontal: -SPACING.lg, paddingLeft: SPACING.lg, marginBottom: 24 },
  hCard: {
    width: 150, backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, overflow: 'hidden', marginRight: 12, ...SHADOWS.sm,
  },
  hCardImage: { width: '100%', height: 180, backgroundColor: COLORS.inputBg },
  hDiscountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.danger, borderRadius: RADIUS.sm,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  hDiscountText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  newBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#059669', borderRadius: RADIUS.sm,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  newBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  hCardInfo: { padding: 10 },
  hCardName: { fontSize: 12, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  hCardPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  brandChip: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
  },
  brandChipText: { fontSize: 12, fontWeight: '600', color: COLORS.dark },
  promiseCard: { borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center' },
  promiseEmoji: { fontSize: 40, marginBottom: 10 },
  promiseTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  promiseSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
