import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { performVirtualTryOn } from '../services/vertexAI';

export default function VirtualTryOnScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  const [personImage, setPersonImage] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🛡️ BOLD ACTION: Standard Web File Input logic for Gallery/Camera
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPersonImage(URL.createObjectURL(file));
  };

  const handleTryOn = async () => {
    if (!personImage) return alert('Please upload your portrait first.');
    setLoading(true);
    const res = await performVirtualTryOn(personImage, product.image, product.name);
    setLoading(false);
    if (res.success) setResultUri(res.imageUri);
    else alert('AI Error: ' + res.error);
  };

  return (
    <div style={styles.root}>
      {/* 🏙️ STUDIO NAV */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
           <button onClick={() => navigate(-1)} style={styles.backLink}>← BACK</button>
           <h1 style={styles.headerTitle}>AI VIRTUAL FITTING STUDIO</h1>
           <div style={{ width: 80 }} />
        </div>
      </header>

      <main style={styles.studioBody}>
        <div style={styles.studioLayout}>
          {/* 🟦 LEFT: STUDIO CONTROLS */}
          <section style={styles.controlSection}>
             <div style={styles.studioCard}>
                <h3 style={styles.cardHeader}>1. PERSONAL PORTRAIT</h3>
                <div style={styles.actionPad}>
                   {personImage ? (
                      <div style={styles.previewWrap}>
                         <img src={personImage} style={styles.previewImg} alt="Portrait" />
                         <button style={styles.resetBtn} onClick={() => setPersonImage(null)}>✕ CHANGE PHOTO</button>
                      </div>
                   ) : (
                      <div style={styles.uploadRow}>
                         <label style={styles.iconBtn}>
                            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                            <span style={{ fontSize: 32 }}>🖼️</span>
                            <span style={styles.btnLabel}>GALLERY / DEVICE</span>
                         </label>
                         <label style={styles.iconBtn}>
                            <input type="file" style={{ display: 'none' }} accept="image/*" capture="user" onChange={handleFileUpload} />
                            <span style={{ fontSize: 32 }}>📸</span>
                            <span style={styles.btnLabel}>CAMERA</span>
                         </label>
                      </div>
                   )}
                </div>
                <p style={styles.studioTip}>Tip: Use a clear, well-lit portrait for best results.</p>
             </div>

             <div style={{...styles.studioCard, marginTop: '30px'}}>
                <h3 style={styles.cardHeader}>2. SELECTED PRODUCT</h3>
                <div style={styles.productRow}>
                   <img src={product.image} style={styles.miniProdImg} alt={product.name} />
                   <div>
                      <h4 style={styles.miniProdName}>{product.name}</h4>
                      <span style={styles.miniProdBrand}>{product.brand.toUpperCase()}</span>
                   </div>
                </div>
             </div>

             <button 
               style={{...styles.generateBtn, opacity: (loading || !personImage) ? 0.5 : 1}} 
               disabled={loading || !personImage}
               onClick={handleTryOn}
             >
                {loading ? 'SYNTHESIZING STYLES...' : 'GENERATE AI FITTING'}
             </button>
          </section>

          {/* 🟩 RIGHT: STUDIO VISUALIZER */}
          <section style={styles.visualizerSection}>
             <div style={styles.visualizerCard}>
                <div style={styles.vHeader}>
                   <h3 style={styles.vTitle}>AI WORKSPACE</h3>
                   <div style={styles.dot} />
                </div>
                <div style={styles.renderWindow}>
                   {loading ? (
                     <div style={styles.loader}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '20px', fontSize: '10px', letterSpacing: '2px' }}>VIRTUAL REALITY RENDERING...</p>
                     </div>
                   ) : resultUri ? (
                     <img src={resultUri} style={styles.finalRender} alt="Result" />
                   ) : (
                     <div style={styles.emptyState}>
                        <img src={product.image} style={styles.bgGhost} alt="Background" />
                        <div style={styles.overlayText}>
                           <span style={{ fontSize: 48 }}>✨</span>
                           <h2 style={styles.emptyTitle}>STUDIO READY</h2>
                        </div>
                     </div>
                   )}
                </div>
                {resultUri && (
                   <button style={styles.bagBtn} onClick={() => navigate('/checkout', { state: { product, qty: 1 } })}>
                      ADD THIS LOOK TO BAG
                   </button>
                )}
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: { minHeight: '100vh', backgroundColor: '#F8F8F6' },
  header: { 
    height: '80px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEE', 
    display: 'flex', alignItems: 'center', justifyContent: 'center' 
  },
  headerContent: { width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' },
  backLink: { background: 'none', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '800', letterSpacing: '2px' },
  headerTitle: { fontSize: '13px', fontWeight: '900', letterSpacing: '6px' },

  studioBody: { width: '100%', display: 'flex', justifyContent: 'center', padding: '40px 0' },
  studioLayout: { width: '100%', maxWidth: '1200px', display: 'flex', gap: '60px', padding: '0 40px' },

  controlSection: { flex: 0.8 },
  studioCard: { backgroundColor: '#FFFFFF', padding: '30px', border: '1px solid #F0F0F0' },
  cardHeader: { fontSize: '9px', fontWeight: '800', color: '#AAA', letterSpacing: '2px', marginBottom: '25px' },
  actionPad: { backgroundColor: '#F9F9F9', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadRow: { display: 'flex', gap: '30px' },
  iconBtn: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  btnLabel: { fontSize: '9px', fontWeight: '800', color: '#000', letterSpacing: '1px' },
  previewWrap: { position: 'relative', width: '100%', height: '350px' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  resetBtn: { position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', color: '#FFF', border: 'none', padding: '10px 20px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' },
  studioTip: { fontSize: '10px', color: '#BBB', marginTop: '20px', textAlign: 'center', fontStyle: 'italic' },

  productRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  miniProdImg: { width: '50px', height: '70px', objectFit: 'cover' },
  miniProdName: { fontSize: '14px', fontWeight: '800' },
  miniProdBrand: { fontSize: '9px', color: '#BBB', letterSpacing: '1px' },
  generateBtn: { width: '100%', height: '65px', backgroundColor: '#000', color: '#FFF', border: 'none', marginTop: '40px', fontWeight: '900', letterSpacing: '3px', cursor: 'pointer' },

  visualizerSection: { flex: 1.2 },
  visualizerCard: { backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0', overflow: 'hidden' },
  vHeader: { padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0F0F0' },
  vTitle: { fontSize: '11px', fontWeight: '800', letterSpacing: '3px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52A535' },
  renderWindow: { width: '100%', aspectRatio: '3/4.5', backgroundColor: '#F9F9F9', position: 'relative' },
  finalRender: { width: '100%', height: '100%', objectFit: 'cover' },
  emptyState: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bgGhost: { position: 'absolute', width: '100%', height: '100%', opacity: 0.1, objectFit: 'cover' },
  overlayText: { position: 'relative', zIndex: 1, textAlign: 'center' },
  emptyTitle: { fontSize: '12px', fontWeight: '900', color: '#CCC', letterSpacing: '6px' },
  bagBtn: { width: '100%', height: '75px', backgroundColor: '#000', color: '#FFF', border: 'none', fontWeight: '900', letterSpacing: '3px', cursor: 'pointer' },
  loader: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
};
