import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, useWindowDimensions, StatusBar
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../utils/theme';
import { PRODUCTS } from '../data/products';

export default function CategoryScreen({ route, navigation }) {
  const { title, filter } = route.params;
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 800;
  
  const [sortBy, setSortBy] = useState('New In');

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => 
      p.category === filter || p.subCategory === filter || p.gender === filter
    );

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [filter, sortBy]);

  const numColumns = isDesktop ? 4 : 2;
  const contentPadding = isDesktop ? 60 : 20;

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productImageBox}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.tryOnTag}
          onPress={() => navigation.navigate('VirtualTryOn', { product: item })}
        >
          <Text style={styles.tryOnTagText}>VIRTUAL FITTING</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.brandTitle}>{item.brand.toUpperCase()}</Text>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.priceText}>₹{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.backLink}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.count}>{filteredProducts.length} ARTICLES</Text>
      </View>

      {/* Sort Bar */}
      <View style={[styles.sortBar, { paddingHorizontal: contentPadding }]}>
         {/* Sort links */}
         {['NEW IN', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW'].map(opt => (
           <TouchableOpacity key={opt} onPress={() => setSortBy(opt)}>
              <Text style={[styles.sortLink, sortBy === opt && styles.sortLinkActive]}>
                {opt}
              </Text>
           </TouchableOpacity>
         ))}
      </View>

      <FlatList
        key={isDesktop ? 'cat-desktop' : 'cat-mobile'}
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={i => i.id}
        numColumns={numColumns}
        columnWrapperStyle={{ gap: 40, marginBottom: 40, paddingHorizontal: contentPadding }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backLink: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 8 },
  count: { fontSize: 11, color: '#999', letterSpacing: 2 },

  sortBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 30,
    marginBottom: 20,
  },
  sortLink: { fontSize: 10, fontWeight: '500', color: '#999', letterSpacing: 1 },
  sortLinkActive: { color: '#000', fontWeight: '800' },

  listContent: { paddingVertical: 20 },
  productCard: { flex: 1 },
  productImageBox: { backgroundColor: '#F9F9F9', height: 400, position: 'relative', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  tryOnTag: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#000', height: 40, alignItems: 'center', justifyContent: 'center',
  },
  tryOnTagText: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  
  productInfo: { marginTop: 15, alignItems: 'center' },
  brandTitle: { fontSize: 10, color: '#999', fontWeight: '500', letterSpacing: 1 },
  productTitle: { fontSize: 13, color: '#000', marginTop: 4, textAlign: 'center' },
  priceText: { fontSize: 13, fontWeight: '700', color: '#000', marginTop: 10 },
});
