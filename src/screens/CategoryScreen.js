import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Dimensions, StatusBar, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.sm) / 2;

export default function CategoryScreen({ route, navigation }) {
  const { title, filter } = route.params;
  const [sortBy, setSortBy] = React.useState('popular'); // popular, lowToHigh, highToLow

  // Filter products by category or subcategory
  let filteredProducts = PRODUCTS.filter(p => 
    p.category === filter || p.subCategory === filter || filter === 'For You'
  );

  // Apply Sorting
  if (sortBy === 'lowToHigh') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'highToLow') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.imageBox}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.discount}% OFF</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item?.price?.toLocaleString()}</Text>
          <Text style={styles.originalPrice}>₹{item?.originalPrice?.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {[
            { id: 'popular', label: 'Popularity' },
            { id: 'lowToHigh', label: 'Price: Low to High' },
            { id: 'highToLow', label: 'Price: High to Low' }
          ].map(opt => (
            <TouchableOpacity 
              key={opt.id} 
              style={[styles.filterChip, sortBy === opt.id && styles.filterChipActive]}
              onPress={() => setSortBy(opt.id)}
            >
              <Text style={[styles.filterText, sortBy === opt.id && styles.filterTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>📦</Text>
            <Text style={styles.emptyText}>No items found in {title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    height: 60, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    ...Platform.select({ ios: { paddingTop: 20 }, android: { paddingTop: 0 } }),
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backBtnIcon: { fontSize: 24, color: COLORS.dark },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.dark, letterSpacing: 1 },
  filterBar: {
    backgroundColor: COLORS.white, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBg, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: { backgroundColor: '#EFF6FF', borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.primary },
  list: { padding: SPACING.lg, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: SPACING.md },
  productCard: {
    width: CARD_WIDTH, backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.sm,
  },
  imageBox: { width: '100%', height: 180, backgroundColor: COLORS.inputBg },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.danger, borderRadius: RADIUS.sm,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  info: { padding: 10 },
  brand: { fontSize: 10, color: COLORS.textLight, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  name: { fontSize: 13, fontWeight: '600', color: COLORS.dark, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
  originalPrice: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: COLORS.textLight, fontSize: 14 },
});
