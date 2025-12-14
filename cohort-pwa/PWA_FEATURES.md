# 🦊 Metallic Fox - Counter PWA

## Overview
A beautifully designed Progressive Web App (PWA) for counting with the "Metallic Fox" theme. The app features a stunning dark gradient UI with red and orange accents inspired by metallic fox colors.

## Features

### 🎯 Core Functionality
- **Counter App**: Increment (+), Decrement (−), and Reset buttons
- **Persistent Storage**: Counter values are automatically saved to localStorage
- **Data Persistence**: Your count persists even after closing the app

### 📱 PWA Features
- **Installable**: Download and install as a native app on mobile and desktop
- **Offline Support**: Full offline functionality with service worker caching
- **Fast Loading**: Optimized build with Tailwind CSS
- **Responsive Design**: Works perfectly on all screen sizes

### 💾 Install Prompt
- **Download Button**: Easy install button appears for first-time users
- **Auto-Detection**: Automatically detects when app is installed
- **Status Indicator**: Shows "✓ App Installed" when successfully installed

### 🎨 UI/UX Design
- **Metallic Fox Theme**: Dark gradient background (red/brown/orange)
- **Beautiful Gradients**: Orange-to-red gradient counter display
- **Smooth Animations**: Hover and click animations on buttons
- **Mobile Optimized**: Perfect scaling on all devices

### 📦 Service Worker
- **Cache-First Strategy**: Static assets cached for instant loading
- **Runtime Caching**: Dynamic content cached for offline access
- **Automatic Updates**: App updates available with auto-update detection
- **Manifest Injection**: Workbox-powered service worker with manifest injection

## Building and Running

### Development
```bash
npm run dev
# Server runs at http://localhost:5173
```

### Production Build
```bash
npm run build
# Creates optimized production build in dist/
```

### Preview Production Build
```bash
npm run preview
# Preview production build at http://localhost:4174
```

## Technology Stack
- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **PWA**: vite-plugin-pwa with Workbox
- **Service Worker**: Injection-based approach with precaching

## Key Files
- `src/App.jsx` - Main counter component
- `src/App.css` - Global styles for dark theme
- `index.html` - HTML with PWA meta tags
- `public/manifest.json` - PWA manifest configuration
- `public/sw.js` - Service worker implementation
- `vite.config.js` - Vite and PWA plugin configuration

## PWA Configuration
- **Name**: Metallic Fox - Counter App
- **Theme Color**: #df0505ff (Metallic Red)
- **Background Color**: #3d0a0a (Dark Red)
- **Display Mode**: Standalone (app-like experience)
- **Icons**: Multiple sizes (48x48 to 512x512)

## Installation Methods

### Browser
1. Visit http://localhost:4174 (or your deployment URL)
2. Look for the install button in the UI
3. Click "Download App" to install

### Mobile (Chrome/Android)
1. Click the "+" icon in the address bar
2. Select "Install app"
3. App appears on home screen

### iOS
1. Share button → Add to Home Screen
2. App appears on home screen

## Offline Capabilities
- Full counter functionality works offline
- All assets cached for instant loading
- Local storage sync for count persistence
- Automatic sync when back online

## Browser Support
- Chrome/Chromium (Best support)
- Firefox (Excellent support)
- Safari (iOS 11.3+)
- Edge (Excellent support)

## Performance Optimizations
- Minified and gzipped assets
- Efficient Tailwind CSS tree-shaking
- Service worker precaching for faster loads
- Runtime caching for dynamic content
- Optimized bundle size (≈63KB gzipped)

---

**Created**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
