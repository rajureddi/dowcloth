import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  root: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: 'Poppins, sans-serif' },
  header: { 
    height: '80px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0F0F0', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100 
  },
  headerContent: { width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '800', letterSpacing: '2px' },
  headerTitle: { fontSize: '13px', fontWeight: '900', letterSpacing: '6px' },

  mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', padding: '60px 0' },
  checkoutLayout: { width: '100%', maxWidth: '1200px', padding: '0 40px' },

  sumSection: { flex: 1, minWidth: '350px' },
  paySection: { flex: 1, minWidth: '350px' },

  sectionHeader: { fontSize: '9px', fontWeight: '800', color: '#AAA', letterSpacing: '3px', marginBottom: '30px' },
  summaryCard: { backgroundColor: '#F9F9F9', padding: '35px', borderRadius: '4px' },
  itemRow: { display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '25px' },
  itemImg: { width: '70px', height: '90px', objectFit: 'cover' },
  itemMeta: { flex: 1 },
  itemBrand: { color: '#BBB', fontSize: '10px', fontWeight: '600', letterSpacing: '1.5px' },
  itemName: { fontSize: '15px', fontWeight: '800', margin: '5px 0' },
  itemSub: { fontSize: '11px', color: '#999' },
  itemPrice: { fontSize: '16px', fontWeight: '900' },

  billBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  billLine: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' },
  totalLine: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: '14px', fontWeight: '900' },
  totalVal: { fontSize: '24px', fontWeight: '900', color: '#000' },
  delLabel: { fontSize: '11px', color: '#1E40AF', fontWeight: '800', marginTop: '25px', fontStyle: 'italic' },

  methodsWrapper: { display: 'flex', flexDirection: 'column', gap: '15px' },
  payCard: { 
    display: 'flex', alignItems: 'center', padding: '25px', 
    border: '1.5px solid', cursor: 'pointer', transition: 'all 0.3s' 
  },
  radioCircle: { width: '18px', height: '18px', borderRadius: '50%' },
  payName: { fontSize: '14px' },
  payTag: { fontSize: '8px', color: '#BBB', letterSpacing: '1px', marginTop: '4px' },

  placeOrderBtn: { 
    width: '100%', height: '75px', backgroundColor: '#000', color: '#FFF', 
    border: 'none', marginTop: '45px', fontWeight: '900', letterSpacing: '3px', cursor: 'pointer' 
  },
  secureBottom: { marginTop: '30px', textAlign: 'center', fontSize: '10px', color: '#BBB', letterSpacing: '2px', fontWeight: '800' },
  mainLayout: {}, // Defined as object
};

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, qty } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const totalPrice = (product?.price || 0) * (qty || 1);

  const paymentMethods = [
    { id: 'UPI', name: 'Google Pay / PhonePe', icon: '⚡' },
    { id: 'CARD', name: 'Credit / Debit Card', icon: '💳' },
    { id: 'NET', name: 'Net Banking', icon: '🏦' },
    { id: 'COD', name: 'Cash on Delivery', icon: '💵' },
  ];

  return (
    <div style={styles.root}>
      {/* 🏙️ STICKY WEB HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← BACK</button>
          <h1 style={styles.headerTitle}>SECURE CHECKOUT</h1>
          <div style={{ width: 80 }} />
        </div>
      </header>

      <main style={styles.mainContainer}>
         <div style={styles.checkoutLayout}>
            <div style={{ ...styles.mainLayout, display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
               
               {/* 🛍️ LEFT: ORDER SUMMARY */}
               <section style={styles.sumSection}>
                  <h3 style={styles.sectionHeader}>ORDER SUMMARY</h3>
                  <div style={styles.summaryCard}>
                     <div style={styles.itemRow}>
                        <img src={product?.image} style={styles.itemImg} alt="Item" />
                        <div style={styles.itemMeta}>
                           <span style={styles.itemBrand}>{product?.brand?.toUpperCase()}</span>
                           <h4 style={styles.itemName}>{product?.name}</h4>
                           <p style={styles.itemSub}>Qty: {qty} • Size: M</p>
                        </div>
                        <span style={styles.itemPrice}>₹{product?.price?.toLocaleString()}</span>
                     </div>

                     <div style={styles.billBox}>
                        <div style={styles.billLine}><span>Price ({qty} item)</span><span>₹{totalPrice.toLocaleString()}</span></div>
                        <div style={styles.billLine}><span>Delivery Fee</span><span style={{ color: '#22C55E' }}>FREE</span></div>
                        <div style={styles.totalLine}>
                           <span style={styles.totalLabel}>TOTAL AMOUNT</span>
                           <span style={styles.totalVal}>₹{totalPrice.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
                  <p style={styles.delLabel}>📍 Delivering to Bengaluru/Hyderabad in 60 mins</p>
               </section>

               {/* 💳 RIGHT: PAYMENT */}
               <section style={styles.paySection}>
                   <h3 style={styles.sectionHeader}>SELECT PAYMENT METHOD</h3>
                   <div style={styles.methodsWrapper}>
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id} 
                          style={{...styles.payCard, borderColor: selectedMethod === method.id ? '#000' : '#EEE', backgroundColor: selectedMethod === method.id ? '#F9F9F9' : '#FFF'}}
                          onClick={() => setSelectedMethod(method.id)}
                        >
                           <span style={{ fontSize: '24px' }}>{method.icon}</span>
                           <div style={{ flex: 1, paddingLeft: '20px' }}>
                              <h4 style={{...styles.payName, color: selectedMethod === method.id ? '#000' : '#888', fontWeight: selectedMethod === method.id ? '900' : '600'}}>{method.name}</h4>
                              <p style={styles.payTag}>SECURE & ENCRYPTED</p>
                           </div>
                           <div style={{...styles.radioCircle, borderColor: selectedMethod === method.id ? '#000' : '#DDD', borderWidth: selectedMethod === method.id ? '5px' : '1.5px', borderStyle: 'solid'}} />
                        </div>
                      ))}
                   </div>

                   <button style={styles.placeOrderBtn} onClick={() => alert('Payment Initiated... Connecting to Secure Gateway')}>
                      PLACE ORDER • ₹{totalPrice.toLocaleString()}
                   </button>

                   <div style={styles.secureBottom}>🔒 100% SECURE TRANSACTIONS</div>
               </section>

            </div>
         </div>
      </main>
    </div>
  );
}

