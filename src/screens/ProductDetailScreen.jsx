import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function ProductDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <div style={styles.root}>
      {/* 🏙️ STICKY WEB HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← BACK</button>
          <h1 style={styles.headerLogo}>DOWCLOTH</h1>
          <div style={styles.bagIcon}>🛍️</div>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.detailLayout}>
          
          {/* 👗 PRODUCT VISUALS */}
          <section style={styles.imageSection}>
             <img src={product.image} style={styles.mainImg} alt={product.name} />
             <button 
               style={styles.vtoFloatingBtn}
               onClick={() => navigate(`/virtual-vto/${product.id}`)}
             >
                <span style={{ marginRight: '10px' }}>✨</span>
                VIRTUAL FITTING ROOM
             </button>
          </section>

          {/* 🏷️ PRODUCT INFO */}
          <section style={styles.infoSection}>
             <div style={styles.deliveryBadge}>
                <span style={styles.locLabel}>📍 DELIVERING TO BENGALURU / HYDERABAD</span>
                <h4 style={styles.delMsg}>⚡ INSTANT DELIVERY IN 60 MINUTES</h4>
             </div>

             <span style={styles.brandName}>{product.brand.toUpperCase()}</span>
             <h1 style={styles.prodName}>{product.name}</h1>
             <span style={styles.price}>₹{product.price.toLocaleString()}</span>

             <div style={styles.divider} />

             <p style={styles.description}>
                {product.description || 'A stunning piece perfect for any occasion. Crafted with the finest materials for ultimate comfort and elite style.'}
             </p>

             <div style={styles.selectorRow}>
                <div style={{ flex: 1 }}>
                   <label style={styles.selectLabel}>SELECT SIZE</label>
                   <div style={styles.sizeGrid}>
                      {['S', 'M', 'L', 'XL'].map(s => (
                        <button 
                          key={s} 
                          style={{...styles.sizeBtn, backgroundColor: selectedSize === s ? '#000' : '#FFF', color: selectedSize === s ? '#FFF' : '#000'}}
                          onClick={() => setSelectedSize(s)}
                        >
                           {s}
                        </button>
                      ))}
                   </div>
                </div>

                <div style={{ width: '120px' }}>
                   <label style={styles.selectLabel}>QTY</label>
                   <div style={styles.qtyBox}>
                      <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                      <span style={styles.qtyVal}>{qty}</span>
                      <button style={styles.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
                   </div>
                </div>
             </div>

             <div style={styles.actionGroup}>
                <button style={styles.addToBagBtn}>ADD TO BAG</button>
                <button 
                  style={styles.buyNowBtn}
                  onClick={() => navigate('/checkout', { state: { product, qty } })}
                >
                   BUY NOW (Proceed to Payment)
                </button>
             </div>

             <footer style={styles.promiseRow}>
                FREE RETURNS • 100% GENUINE • EXPRESS CASH ON DELIVERY
             </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: 'Poppins, sans-serif' },
  header: { 
    height: '80px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F2F2F2', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100 
  },
  headerContent: { width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '800', letterSpacing: '2px' },
  headerLogo: { fontSize: '18px', fontWeight: '900', letterSpacing: '8px' },
  bagIcon: { cursor: 'pointer', fontSize: '20px' },

  mainContent: { width: '100%', display: 'flex', justifyContent: 'center', padding: '60px 0' },
  detailLayout: { width: '100%', maxWidth: '1200px', display: 'flex', gap: '80px', padding: '0 40px' },

  imageSection: { flex: 1.2, position: 'relative', backgroundColor: '#F9F9F9' },
  mainImg: { width: '100%', height: '800px', objectFit: 'cover' },
  vtoFloatingBtn: { 
    position: 'absolute', top: '30px', right: '30px', 
    backgroundColor: '#000', color: '#FFF', border: 'none', 
    padding: '15px 30px', borderRadius: '40px', fontWeight: '800', 
    fontSize: '10px', letterSpacing: '1.5px', cursor: 'pointer', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
  },

  infoSection: { flex: 1, paddingTop: '20px' },
  deliveryBadge: { backgroundColor: '#F0F7FF', padding: '25px', borderRadius: '4px', marginBottom: '40px' },
  locLabel: { fontSize: '9px', fontWeight: '800', color: '#1E40AF', letterSpacing: '1px' },
  delMsg: { fontSize: '11px', fontWeight: '900', color: '#1E40AF', marginTop: '5px' },

  brandName: { color: '#AAA', fontSize: '11px', fontWeight: '600', letterSpacing: '2px' },
  prodName: { fontSize: '42px', fontWeight: '900', color: '#000', margin: '15px 0' },
  price: { fontSize: '24px', fontWeight: '900', color: '#000' },
  divider: { height: '1px', backgroundColor: '#EEE', margin: '40px 0' },
  description: { fontSize: '15px', color: '#555', lineHeight: '28px' },

  selectorRow: { marginTop: '50px', display: 'flex', gap: '50px' },
  selectLabel: { fontSize: '11px', fontWeight: '900', letterSpacing: '2px', display: 'block', marginBottom: '20px' },
  sizeGrid: { display: 'flex', gap: '12px' },
  sizeBtn: { 
    width: '50px', height: '50px', border: '1px solid #EEE', 
    cursor: 'pointer', fontWeight: '600', fontSize: '12px', transition: 'all 0.3s' 
  },
  qtyBox: { 
    height: '50px', border: '1px solid #EEE', 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px' 
  },
  qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' },
  qtyVal: { fontWeight: '700', fontSize: '14px' },

  actionGroup: { marginTop: '60px', display: 'flex', flexDirection: 'column', gap: '15px' },
  addToBagBtn: { 
    height: '70px', border: '1.5px solid #000', backgroundColor: '#FFF', 
    fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s' 
  },
  buyNowBtn: { 
    height: '70px', backgroundColor: '#000', color: '#FFF', border: 'none', 
    fontWeight: '900', letterSpacing: '3px', cursor: 'pointer' 
  },
  promiseRow: { marginTop: '60px', textAlign: 'center', fontSize: '9px', color: '#CCC', fontWeight: '700', letterSpacing: '2px' },
};
