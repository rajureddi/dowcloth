# 👚 DowCloth: India's First Instant Fashion Platform
![Project Status](https://img.shields.io/badge/Status-Freelancing%20Project-2563EB?style=for-the-badge)

**DowCloth** is a revolutionary high-fidelity fashion retail platform that bridges the gap between digital selection and instant ownership. By combining **10-60 minute hyper-local delivery** with a professional **Google Vertex AI-powered Virtual Try-On (VTO)** engine, DowCloth eliminates the two biggest hurdles in online fashion: **Waiting time** and **Fit uncertainty**.

---

## ✨ KEY FEATURES

### 🪄 1. AI-Powered Virtual Try-On (VTO)
Experience the future of fitting rooms! Powered by Google **Vertex AI (virtual-try-on-001)**, our VTO engine allows users to:
*   **Identity Preserving Fitting**: Realistically apply clothes to any user photo while keeping the person's unique features intact.
*   **Diverse Category Mapping**: Support for **Dresses, Ethnic Wear, Formal Shirts, Blazers, and Hoodies**.
*   **High-Resolution Results**: Professional-grade fitting visualizations for a retail-ready experience.

### 🍱 2. Professional Catalog & UI
Designed for a premium, glassmorphism-influenced aesthetic:
*   **Mega Catalog**: 30+ products mapped locally across 8+ categories like **Footwear (Sneakers/Formal/Heels)**, **Blazers**, **Ethnic**, and **Women's Tops**.
*   **Smart Sorting**: Instant "Price: High to Low" and "Low to High" filtering on every category page.
*   **Universal Platform**: Built with **Expo** to run natively on **Android** and as a high-performance **Web Portal (React Native Web)**.

### ⚡ 3. Instant Hyper-Local Delivery
Our system is architected for speed (10-60min), targeting immediate fashion needs for weddings, dates, or formal events.

---

## 🛠️ TECH STACK
*   **Frontend**: React Native (Expo SDK 54 / React Native Web)
*   **AI Backend**: Google Vertex AI `virtual-try-on-001`
*   **Authentication**: Secure JWT (RS256) implementation with `jsrsasign`
*   **Imaging**: Expo ImagePicker + FileSystem for stable mobile uploads.

---

## 🚀 GETTING STARTED

### 1. Installation
```bash
npm install
# Or
npx expo prebuild
```

### 2. Configure Vertex AI (REQUIRED)
DowCloth uses Google Vertex AI. To run the VTO feature locally:
1.  Place your Google Cloud Service Account JSON key in the root directory.
2.  Update the `PROJECT_ID` in `src/services/vertexAI.js`.
3.  Ensure the **Vertex AI API** is enabled in your Google Cloud Console.

### 3. Run Locally
*   **Android**: `npx expo run:android`
*   **Web**: `npm run web`

---

## 🛡️ SECURITY & PRIVACY
*   **Privacy**: User photos uploaded for try-on are processed via Google's secure Vertex AI endpoints.
*   **Zero-Storage**: Local caches are cleared between sessions to ensure data privacy.
*   **Safety**: All private keys are excluded from this repository via `.gitignore` for security.

---

## 📍 ROADMAP
- [ ] **Lottie Animations**: Adding fluid loading animations for AI processing.
- [ ] **Secure Backend Proxy**: Moving all client-side private keys to a secure Node.js middleware.
- [ ] **Real-Time Tracking**: Integration with hyper-local delivery APIs.

---
© 2026 DowCloth • Bengaluru, India • Fashion. Instant. You.

