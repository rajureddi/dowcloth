import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import VirtualTryOnScreen from './src/screens/VirtualTryOnScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

// 🛡️ GLOBAL CSS INJECTION for LUXURY SCROLLBAR
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
      font-family: 'Poppins', sans-serif; 
    }

    body {
      background-color: #FFFFFF;
      overflow-y: scroll !important; /* Force native scrollbar */
    }

    /* Professional Desktop Scrollbar */
    ::-webkit-scrollbar {
      width: 12px;
    }
    ::-webkit-scrollbar-track {
      background: #F8F8F6;
    }
    ::-webkit-scrollbar-thumb {
      background: #CCCCCC;
      border: 3px solid #F8F8F6;
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
