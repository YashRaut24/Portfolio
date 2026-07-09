const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_URL } = require('./config/env');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());

app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use('/api/contact', contactRoutes);

app.use(errorHandler);

module.exports = app;