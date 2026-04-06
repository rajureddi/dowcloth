import { Platform } from 'react-native';
/**
 * 🏛️ DOWCLOTH HIGH-END THEME
 * Inspired by Luxury Fashion Portals (SSENSE, VOGUE, FARFETCH)
 */
export const COLORS = {
  primary: '#000000',      // Deep Black
  secondary: '#1A1A1A',    // Slate
  accent: '#7D7D7D',       // Grey Editorial
  background: '#F9F9F7',   // Ivory Canvas
  white: '#FFFFFF',
  border: '#E8E8E8',       // Minimalist Border
  text: '#121212',         // Rich Black
  textSecondary: '#666666',
  textLight: '#999999',
  danger: '#A52A2A',       // Luxury Red
  success: '#2E7D32',
  shadow: 'rgba(0,0,0,0.06)',
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const RADIUS = {
  sm: 2, md: 4, lg: 8, full: 9999,
};

export const SHADOWS = {
  sm: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    android: { elevation: 2 },
    web: { boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  }),
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    android: { elevation: 5 },
    web: { boxShadow: '0 8px 30px rgba(0,0,0,0.04)' },
  }),
  lg: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
    android: { elevation: 8 },
    web: { boxShadow: '0 15px 50px rgba(0,0,0,0.08)' },
  }),
};

export const FONTS = {
  thin: '300', regular: '400', medium: '500', semiBold: '600', bold: '700', extraBold: '800',
};
