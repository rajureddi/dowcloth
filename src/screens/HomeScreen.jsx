import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { COLORS, SHADOWS, RADIUS } from '../utils/theme';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('For You');

  const filteredProducts = activeCategory === 'For You'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory || p.subCategory === activeCategory);

  return (
    <div style={styles.root}>
      {/* 🏙️ DESKTOP SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
           <div style={styles.locBox}>
              <span style={styles.locTag}>📍 DELIVERING TO</span>
              <h2 style={styles.locCity}>BENGALURU / HYDERABAD</h2>
           </div>
           <div style={styles.delPill}>⚡ 60 MINS</div>
        </div>
        
        <nav style={styles.navSection}>
          <h3 style={styles.navHeader}>CURATIONS</h3>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              style={{...styles.navBtn, color: activeCategory === cat.name ? '#000' : '#888', fontWeight: activeCategory === cat.name ? '900' : '500'}}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
           <p style={styles.fCity}>📍 BENGALURU / HYDERABAD</p>
           <p style={styles.fSub}>EXPRESS DELIVERY ACTIVE</p>
        </div>
      </aside>

      {/* 🛍️ MAIN FEED CONTENT */}
      <main style={styles.mainFeed}>
        <header style={styles.webHeader}>
           <h1 style={styles.logo}>DOWCLOTH</h1>
           <div style={styles.bagBox}>🛍️</div>
        </header>

        <section style={styles.heroSection}>
           <img 
             src={require('../../assets/images/banner_hero.png')} 
             style={styles.heroImg} 
             alt="Couture Banner" 
           />
           <div style={styles.heroOverlay}>
              <span style={styles.heroTag}>S/S 26 COLLECTION</span>
              <h1 style={styles.heroTitle}>BEYOND<br/>INSTANT</h1>
              <button style={styles.heroBtn}>EXPLORE THE EDIT</button>
           </div>
        </section>

        <div style={styles.gridHeader}>
           <h2 style={styles.gridTitle}>CATALOGUE • {activeCategory.toUpperCase()}</h2>
        </div>

        <section style={styles.productGrid}>
           {filteredProducts.map(item => (
             <div 
               key={item.id} 
               style={styles.prodCard} 
               onClick={() => navigate(`/product/${item.id}`)}
             >
                <div style={styles.imgBox}>
                   <img src={item.image} style={styles.prodImg} alt={item.name} />
                   <div style={styles.vtoTag}>INSTANT TRY-ON</div>
                </div>
                <div style={styles.prodInfo}>
                   <span style={styles.brand}>{item.brand.toUpperCase()}</span>
                   <h3 style={styles.name}>{item.name}</h3>
                   <span style={styles.price}>₹{item.price.toLocaleString()}</span>
                </div>
             </div>
           ))}
        </section>

        <footer style={styles.webFooter}>
           <h2 style={styles.footerLogo}>DOWCLOTH</h2>
           <p style={styles.footerSub}>FASHION. INSTANT. YOU.</p>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  root: { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#FFF', 
    fontFamily: 'Poppins, sans-serif' 
  },
  sidebar: { 
    width: '300px', 
    borderRight: '1px solid #F0F0F0', 
    padding: '50px 40px', 
    position: 'sticky', 
    top: 0, 
    height: '100vh' 
  },
  sidebarHeader: { marginBottom: '50px' },
  locBox: { marginBottom: '20px' },
  locTag: { fontSize: '8px', fontWeight: '800', color: '#BBB', letterSpacing: '2px' },
  locCity: { fontSize: '14px', fontWeight: '900', marginTop: '5px' },
  delPill: { 
    display: 'inline-block', 
    padding: '8px 12px', 
    backgroundColor: '#FFEDD5', 
    borderRadius: '4px', 
    fontSize: '9px', 
    fontWeight: '900', 
    color: '#C2410C' 
  },
  navSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  navHeader: { fontSize: '10px', fontWeight: '800', color: '#BBB', letterSpacing: '3px', marginBottom: '10px' },
  navBtn: { 
    background: 'none', 
    border: 'none', 
    textAlign: 'left', 
    cursor: 'pointer', 
    fontSize: '13px', 
    letterSpacing: '1.5px' 
  },
  sidebarFooter: { marginTop: '100px' },
  fCity: { fontSize: '9px', fontWeight: '900', letterSpacing: '3px' },
  fSub: { fontSize: '9px', color: '#BBB', marginTop: '5px' },

  mainFeed: { flex: 1, backgroundColor: '#FFF' },
  webHeader: { 
    height: '80px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '0 40px', 
    borderBottom: '1px solid #F0F0F0' 
  },
  logo: { fontSize: '18px', fontWeight: '900', letterSpacing: '8px' },
  bagBox: { cursor: 'pointer', fontSize: '20px' },

  heroSection: { position: 'relative', width: '100%' },
  heroImg: { width: '100%', height: '700px', objectFit: 'cover' },
  heroOverlay: { 
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)' 
  },
  heroTag: { color: '#FFF', fontSize: '12px', fontWeight: '700', letterSpacing: '8px' },
  heroTitle: { 
    color: '#FFF', fontSize: '100px', fontWeight: '900', textAlign: 'center', 
    lineHeight: '90px', letterSpacing: '10px', margin: '30px 0' 
  },
  heroBtn: { 
    background: 'none', border: '1.5px solid #FFF', color: '#FFF', 
    padding: '20px 40px', cursor: 'pointer', fontWeight: '800', letterSpacing: '3px' 
  },

  gridHeader: { padding: '80px 0 40px 0', textAlign: 'center' },
  gridTitle: { fontSize: '15px', fontWeight: '900', letterSpacing: '4px' },

  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '40px', 
    padding: '0 80px 100px 80px' 
  },
  prodCard: { cursor: 'pointer', textAlign: 'center' },
  imgBox: { position: 'relative', overflow: 'hidden', backgroundColor: '#F9F9F9', aspectRatio: '3/4' },
  prodImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
  vtoTag: { 
    position: 'absolute', bottom: 0, left: 0, width: '100%', 
    height: '40px', backgroundColor: 'rgba(0,0,0,0.9)', 
    color: '#FFF', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', fontSize: '9px', fontWeight: '800', letterSpacing: '2px' 
  },
  prodInfo: { padding: '20px 0' },
  brand: { fontSize: '10px', color: '#BBB', fontWeight: '600', letterSpacing: '2px' },
  name: { fontSize: '14px', margin: '10px 0' },
  price: { fontSize: '15px', fontWeight: '900' },

  webFooter: { padding: '150px 0', backgroundColor: '#111', color: '#FFF', textAlign: 'center' },
  footerLogo: { fontSize: '32px', fontWeight: '900', letterSpacing: '15px', marginBottom: '20px' },
  footerSub: { color: '#444', fontSize: '11px', letterSpacing: '3px' },
};
