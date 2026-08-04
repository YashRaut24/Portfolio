const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_URL } = require('./config/env');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Determine environment
const isProd = process.env.NODE_ENV === 'production';

// 1. Core Security Headers & Content Security Policy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      
      // Allow Google Fonts
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "data:"],
      
      // Framer Motion strictly requires 'unsafe-inline' for dynamic physics and animations
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      
      // Scripts: Lock to self in prod. In dev, allow Vite's inline scripts and eval for HMR.
      scriptSrc: isProd ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      
      // Images: Allow local, SVG data URIs, and GitHub avatars
      imgSrc: ["'self'", "data:", "https://*.githubusercontent.com"],
      
      // Audio: Allow the MP3 sound system to fetch local files
      mediaSrc: ["'self'"],
      
      // Connections: Lock to self/GitHub in prod. Allow Vite websockets in dev.
      connectSrc: isProd 
        ? ["'self'", "https://api.github.com"] 
        : ["'self'", "ws:", "wss:", "http:", "https:", "https://api.github.com"],
      
      // Anti-Clickjacking: Prevent this site from being embedded in an iframe
      frameAncestors: ["'none'"],
      
      // Force HTTPS upgrades for any internal insecure links
      upgradeInsecureRequests: [],
    },
  },
  
  // 2. Strict-Transport-Security (HSTS) - Enforce heavily only in production to avoid localhost lockouts
  hsts: isProd ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,
  
  // 3. Referrer Policy - Protects user privacy when navigating away from the site
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  
  // 4. Cross-Origin Embedder Policy - Disabled to prevent aggressive blocking of external fonts/assets
  crossOriginEmbedderPolicy: false,
}));

// 5. Permissions Policy - Disable unnecessary browser capabilities
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  next();
});

// 6. CORS Configuration
const allowedOrigins = [
  CLIENT_URL, // Your Vercel URL from env
  'http://localhost:5173', // Vite local dev
  'http://localhost:3000'  // CRA local dev
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'));
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/api/contact', contactRoutes);

app.use(errorHandler);

module.exports = app;