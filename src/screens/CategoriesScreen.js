import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Image, Dimensions, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { PRODUCTS, TOP_CATEGORIES } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.sm) / 2;

const SUBCATEGORIES = {
  Women: ['All', 'Dresses', 'Tops', 'Ethnic', 'Blazers', 'Bottomwear'],
  Men: ['All', 'Shirts', 'T-Shirts', 'Bottomwear', 'Ethnic', 'Hoodies'],
  All: ['All', 'Trending', 'New', 'Sale'],
};

const MAIN_CATS = ['All', 'Women', 'Men', 'Unisex'];

export default function CategoriesScreen({ navigation }) {
  const [mainCat, setMainCat] = useState('All');
  const [subCat, setSubCat] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const getFiltered = () => {
    let list = PRODUCTS;
    if (mainCat !== 'All') list = list.filter(p => p.category === mainCat);
    if (subCat !== 'All') list = list.filter(p => p.subCategory === subCat);
    if (sortBy === 'Price: Low') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  };

  const subCats = SUBCATEGORIES[mainCat] || SUBCATEGORIES['All'];

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
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★ {item.rating}</Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryText}>⚡ {item.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️  Categories</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => {
          const sorts = ['Popular', 'Price: Low', 'Price: High', 'Rating'];
          const idx = sorts.indexOf(sortBy);
          setSortBy(sorts[(idx + 1) % sorts.length]);
        }}>
          <Text style={styles.sortBtnText}>⇅  {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Category Tabs */}
      <View style={styles.mainCatRow}>
        {MAIN_CATS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.mainCatTab, mainCat === cat && styles.mainCatTabActive]}
            onPress={() => { setMainCat(cat); setSubCat('All'); }}
          >
            <Text style={[styles.mainCatText, mainCat === cat && styles.mainCatTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub Category */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subCatScroll}>
        {subCats.map(sub => (
          <TouchableOpacity
            key={sub}
            style={[styles.subCatChip, subCat === sub && styles.subCatChipActive]}
            onPress={() => setSubCat(sub)}
          >
            <Text style={[styles.subCatText, subCat === sub && styles.subCatTextActive]}>{sub}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{getFiltered().length} products</Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={getFiltered()}
        renderItem={renderProduct}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
      />
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
  sortBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.dark },
  mainCatRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg, paddingBottom: 12,
  },
  mainCatTab: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  mainCatTabActive: { borderBottomColor: COLORS.primary },
  mainCatText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  mainCatTextActive: { color: COLORS.primary, fontWeight: '800' },
  subCatScroll: {
    backgroundColor: COLORS.white, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  subCatChip: {
    marginLeft: SPACING.lg, paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: RADIUS.full, backgroundColor: COLORS.inputBg,
    borderWidth: 1, borderColor: 'transparent',
  },
  subCatChipActive: { backgroundColor: '#EFF6FF', borderColor: COLORS.primary },
  subCatText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  subCatTextActive: { color: COLORS.primary, fontWeight: '700' },
  resultRow: { paddingHorizontal: SPACING.lg, paddingVertical: 10 },
  resultCount: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  productRow: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.sm },
  productGrid: { paddingBottom: 100 },
  productCard: {
    width: CARD_WIDTH, backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.sm,
  },
  productImageBox: { width: '100%', height: 180, backgroundColor: '#F8F9FF', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.danger, borderRadius: RADIUS.sm,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  tryOnChip: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(37,99,235,0.9)', borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  tryOnChipText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  productInfo: { padding: 10 },
  brandLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.dark, lineHeight: 17, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
  originalPrice: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  star: { fontSize: 11, fontWeight: '700', color: '#B45309', flex: 1 },
  deliveryBadge: { backgroundColor: COLORS.deliveryBadge, paddingHorizontal: 5, paddingVertical: 2, borderRadius: RADIUS.sm },
  deliveryText: { fontSize: 9, color: COLORS.deliveryText, fontWeight: '700' },
});
