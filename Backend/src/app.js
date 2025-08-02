const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// - configuración de rutas
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');

// - configuracion REST
const app = express();

// Habilitar cors
app.use(cors());

// -  Protección contra XSS
app.use(helmet());

// - Protección de peticiones
app.use(express.json({ limit: '10kb' }));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, 
  message: 'Demasiadas peticiones. Intenta más tarde.'
});
app.use(limiter);

// - Rutas
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

module.exports = app;



