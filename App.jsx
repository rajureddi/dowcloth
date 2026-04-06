import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import VirtualTryOnScreen from './src/screens/VirtualTryOnScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

// 🛡️ GLOBAL CSS INJECTION for LUXURY SCROLLBAR and RESPONSIVENESS
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    
    :root {
      --padding-x: 40px;
      --padding-y: 40px;
      --max-width: 1200px;
      --header-height: 140px;
      --section-gap: 80px;
      --grid-gap: 40px;
      --font-hero: 32px;
      --font-title: 24px;
      --font-body: 15px;
    }

    @media (max-width: 768px) {
      :root {
        --padding-x: 20px;
        --padding-y: 20px;
        --section-gap: 40px;
        --grid-gap: 20px;
        --font-hero: 24px;
        --font-title: 18px;
        --font-body: 14px;
      }
      
      /* Force column layout for responsive containers */
      .responsive-flex {
        flex-direction: column !important;
        gap: 20px !important;
      }

      .mobile-hide {
        display: none !important;
      }
      
      .mobile-full-width {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .mobile-padding-0 {
        padding: 0 !important;
      }
    }

    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
      font-family: 'Poppins', sans-serif; 
    }

    body {
      background-color: #FFFFFF;
      overflow-y: scroll !important;
      -webkit-font-smoothing: antialiased;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    button {
      transition: all 0.3s ease;
    }

    button:active {
      transform: scale(0.98);
    }

    /* Professional Desktop Scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #F8F8F6;
    }
    ::-webkit-scrollbar-thumb {
      background: #CCCCCC;
      border: 2px solid #F8F8F6;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #000000;
    }
  `}</style>
);

export default function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
        <Route path="/virtual-vto/:id" element={<VirtualTryOnScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
      </Routes>
    </Router>
  );
}
