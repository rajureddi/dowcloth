import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';

const styles = {
  root: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: 'Poppins, sans-serif' },
  header: { 
    padding: 'var(--padding-y) var(--padding-x)', 
    backgroundColor: '#FFF', 
    borderBottom: '1px solid #F0F0F0', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
  },
  locationPin: { fontSize: '9px', fontWeight: '900', letterSpacing: '4px', textAlign: 'center', marginBottom: '15px' },
  headerCore: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logo: { fontSize: 'var(--font-title)', fontWeight: '900', letterSpacing: '8px' },
  subtext: { fontSize: '8px', color: '#AAA', marginTop: '5px', letterSpacing: '3px' },

  navbar: { 
    display: 'flex', 
    justifyContent: 'center', 
    padding: '15px 0', 
    gap: '20px', 
    borderBottom: '1px solid #F0F0F0',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none'
  },
  navBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', letterSpacing: '2px', padding: '0 10px' },

  heroSection: { padding: 'var(--padding-y) var(--padding-x)' },
  heroBanner: { height: '350px', position: 'relative', overflow: 'hidden', borderRadius: '4px' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', bottom: '20px', left: '20px' },
  heroTitle: { color: '#FFF', fontSize: 'var(--font-hero)', fontWeight: '900', letterSpacing: '2px' },
  heroSub: { color: '#FFF', fontSize: '10px', letterSpacing: '5px' },

  gridContainer: { padding: '0 var(--padding-x)' },
  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
    gap: 'var(--grid-gap)' 
  },
  productCard: { cursor: 'pointer' },
  imageBox: { aspectRatio: '3/4', position: 'relative', overflow: 'hidden', backgroundColor: '#F9F9F9' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  timeTag: { position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#FFF', padding: '4px 8px', fontSize: '8px', fontWeight: '900' },
  productInfo: { marginTop: '15px' },
  brandName: { fontSize: '9px', color: '#BBB', letterSpacing: '1.5px', fontWeight: '700' },
  productName: { fontSize: '14px', fontWeight: '700', margin: '4px 0', height: '40px', overflow: 'hidden' },
  price: { fontSize: '15px', fontWeight: '900' }
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState('ALL');

  const filteredProducts = activeCategory === 'ALL' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div style={styles.root}>
      {/* 🏙️ BENGALURU / HYDERABAD LUXURY HEADER */}
      <header style={styles.header}>
         <div style={styles.locationPin}>📍 BENGALURU / HYDERABAD</div>
         <div style={styles.headerCore}>
            <div style={styles.logo}>DOWCLOTH</div>
            <div style={styles.subtext}>BEYOND INSTANT • ⚡ 60 MINS</div>
         </div>
      </header>

      {/* 🧭 NAVIGATION BAR */}
      <nav style={styles.navbar}>
         {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.name)}
              style={{...styles.navBtn, color: activeCategory === cat.name ? '#000' : '#888', fontWeight: activeCategory === cat.name ? '900' : '500'}}
            >
               {cat.name.toUpperCase()}
            </button>
         ))}
      </nav>

      {/* 🖼️ EDITORIAL HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroBanner}>
           <img 
             src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2670" 
             style={styles.heroImage} 
             alt="Luxury Fashion" 
           />
           <div style={styles.heroOverlay}>
              <h2 style={styles.heroTitle}>CURATED CHIC</h2>
              <p style={styles.heroSub}>SUMMER '26 EDITORIAL</p>
           </div>
        </div>
      </section>

      {/* 🛍️ PRODUCT GRID */}
      <main style={styles.gridContainer}>
        <div style={styles.productGrid}>
           {filteredProducts.map(product => (
             <div key={product.id} style={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}>
                <div style={styles.imageBox}>
                   <img src={product.image} style={styles.productImg} alt={product.name} />
                   <div style={styles.timeTag}>⚡ 45 MINS</div>
                </div>
                <div style={styles.productInfo}>
                   <span style={styles.brandName}>{product.brand?.toUpperCase()}</span>
                   <h3 style={styles.productName}>{product.name}</h3>
                   <span style={styles.price}>₹{product.price.toLocaleString()}</span>
                </div>
             </div>
           ))}
        </div>
      </main>

      <div style={{ height: '100px' }} />
    </div>
  );
}

