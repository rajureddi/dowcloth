import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function CheckoutScreen({ route, navigation }) {
  const { product, size, quantity = 1 } = route.params || {};
  const [payMethod, setPayMethod] = useState('UPI');
  const [address] = useState({
    name: 'Raju B',
    address: '123, MG Road, Indiranagar',
    city: 'Bengaluru, Karnataka 560038',
    phone: '+91 98765 43210',
  });

  const subtotal = product ? product.price * quantity : 0;
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    Alert.alert(
      '🎉 Order Placed Successfully!',
      `Your order has been placed!\n\nEstimated delivery: ${product?.deliveryTime || '45 mins'}\n\nOrder ID: #DC${Math.floor(Math.random() * 900000 + 100000)}`,
      [{ text: 'Track Order', onPress: () => navigation.navigate('Home') }]
    );
  };

  const PAY_METHODS = [
    { id: 'UPI', label: 'UPI', icon: '📱' },
    { id: 'Card', label: 'Card', icon: '💳' },
    { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
    { id: 'Wallet', label: 'DowCloth Wallet', icon: '👝' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.secureChip}>
          <Text style={styles.secureText}>🔒 Secure</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Express Delivery Banner */}
        <LinearGradient colors={['#059669', '#047857']} style={styles.deliveryBanner}>
          <Text style={styles.deliveryBannerText}>⚡ Express Delivery in {product?.deliveryTime || '45 mins'}</Text>
        </LinearGradient>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Delivery Address</Text>
            <TouchableOpacity><Text style={styles.changeBtn}>Change</Text></TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{address.name}</Text>
            <Text style={styles.addressText}>{address.address}</Text>
            <Text style={styles.addressText}>{address.city}</Text>
            <Text style={styles.addressPhone}>{address.phone}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Order Summary</Text>
          {product && (
            <View style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <View style={styles.qtyBadge}><Text style={styles.qtyText}>{quantity}x</Text></View>
                <View>
                  <Text style={styles.orderItemName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.orderItemDetails}>Size: {size} • {product.brand}</Text>
                </View>
              </View>
              <Text style={styles.orderItemPrice}>₹{(product.price * quantity).toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Price Details</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</Text>
              <Text style={styles.priceValue}>₹{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={[styles.priceValue, deliveryFee === 0 && { color: '#059669' }]}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            {product && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount ({product.discount}% OFF)</Text>
                <Text style={[styles.priceValue, { color: '#059669' }]}>
                  -₹{(product.originalPrice * quantity - subtotal).toLocaleString()}
                </Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
            </View>
          </View>
          {deliveryFee === 0 && (
            <Text style={styles.freeDeliveryNote}>🎉 You saved on delivery charges!</Text>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>
          <View style={styles.payMethods}>
            {PAY_METHODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.payMethodBtn, payMethod === m.id && styles.payMethodBtnActive]}
                onPress={() => setPayMethod(m.id)}
              >
                <Text style={styles.payMethodIcon}>{m.icon}</Text>
                <Text style={[styles.payMethodText, payMethod === m.id && styles.payMethodTextActive]}>
                  {m.label}
                </Text>
                {payMethod === m.id && <Text style={styles.payMethodCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Place Order */}
      <View style={styles.bottomBar}>
        <View style={styles.totalDisplay}>
          <Text style={styles.totalDisplayLabel}>Total</Text>
          <Text style={styles.totalDisplayValue}>₹{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.placeOrderGrad}
          >
            <Text style={styles.placeOrderText}>Place Order  ⚡</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark },
  secureChip: {
    backgroundColor: '#ECFDF5', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  secureText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  content: { padding: SPACING.lg, gap: 16 },
  deliveryBanner: {
    borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center',
  },
  deliveryBannerText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  section: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, ...SHADOWS.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.dark, marginBottom: 12 },
  changeBtn: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  addressCard: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg, padding: SPACING.md },
  addressName: { fontSize: 14, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  addressText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  addressPhone: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  orderItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 8,
  },
  orderItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  qtyBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.tagBg, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  orderItemName: { fontSize: 14, fontWeight: '700', color: COLORS.dark },
  orderItemDetails: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  orderItemPrice: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
  priceBreakdown: { gap: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 14, color: COLORS.textSecondary },
  priceValue: { fontSize: 14, fontWeight: '600', color: COLORS.dark },
  totalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12, marginTop: 6,
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.dark },
  totalValue: { fontSize: 18, fontWeight: '900', color: COLORS.dark },
  freeDeliveryNote: { marginTop: 10, fontSize: 12, color: '#059669', fontWeight: '600' },
  payMethods: { gap: 10 },
  payMethodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: SPACING.md, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  payMethodBtnActive: { borderColor: COLORS.primary, backgroundColor: '#EFF6FF' },
  payMethodIcon: { fontSize: 20 },
  payMethodText: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  payMethodTextActive: { color: COLORS.primary, fontWeight: '700' },
  payMethodCheck: { color: COLORS.primary, fontWeight: '900', fontSize: 16 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: SPACING.lg, backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'android' ? SPACING.lg : 30,
    ...SHADOWS.lg,
  },
  totalDisplay: { flex: 1 },
  totalDisplayLabel: { fontSize: 12, color: COLORS.textLight },
  totalDisplayValue: { fontSize: 20, fontWeight: '900', color: COLORS.dark },
  placeOrderBtn: { flex: 2, borderRadius: RADIUS.xl, overflow: 'hidden' },
  placeOrderGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  placeOrderText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});
