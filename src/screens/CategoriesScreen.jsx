import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, useWindowDimensions, FlatList
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../utils/theme';
import { CATEGORIES } from '../data/products';

export default function CategoriesScreen({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 800;
  
  const numColumns = isDesktop ? 4 : 2;

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.catCard, isDesktop && styles.desktopCard]}
      onPress={() => navigation.navigate('Category', { title: item.name, filter: item.name })}
    >
      <View style={styles.imgBox}>
          {/* Using a cleaner abstract icon approach for Ajio-style luxury */}
          <Text style={styles.catEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.catInfo}>
          <Text style={styles.catTitle}>{item.name.toUpperCase()}</Text>
          <Text style={styles.catSub}>VIEW COLLECTION →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Universal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.backLink}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXPLORE EDITIONS</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        key={isDesktop ? 'cat-grid-lux' : 'cat-grid-mob'}
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={[styles.list, isDesktop && { paddingHorizontal: 100 }]}
        columnWrapperStyle={{ gap: 30, marginBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backLink: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  headerTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 6, color: '#000' },
  
  list: { padding: 30, paddingBottom: 100 },
  catCard: { flex: 1, backgroundColor: '#F9F9F9', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  desktopCard: { height: 350 },
  
  imgBox: { 
    height: 200, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFF' 
  },
  catEmoji: { fontSize: 60 },
  
  catInfo: { padding: 25, alignItems: 'center' },
  catTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 4, color: '#000' },
  catSub: { fontSize: 9, fontWeight: '700', color: '#AAA', marginTop: 10, letterSpacing: 2 },
});
