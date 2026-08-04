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
// 6. CORS Configuration
const allowedOrigins = [
  'https://yash-raut-portfolio.vercel.app',
  'https://www.yash-raut-portfolio.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    // Allow tools like Postman or server-to-server requests with no origin, 
    // or if the origin matches your Vercel domains
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      // Instead of crashing with a new Error(), safely deny without breaking preflight headers
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle CORS preflight requests
app.options('/api/contact', cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/contact', contactRoutes);

app.use(errorHandler);

module.exports = app;