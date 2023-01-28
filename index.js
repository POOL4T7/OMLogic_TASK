'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongodb = require('./config/db');
const WalletRoute = require('./routes/WalletRoutes');
const ProductRoute = require('./routes/ProductRoutes');


mongodb();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

app.get('/api', (req, res) => {
  var response = {
    success: 1,
    message: 'Welcome to new era of Collections',
  };
  res.status(200).json(response);
});

app.use('/api/wallet', WalletRoute);
app.use('/api/product', ProductRoute);

/**
 * @description Page NOT FOUND Error
 */
app.use((req, res) => {
  return res.status(404).json({
    success: 0,
    message: `NOT FOUND ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`server is listing in NODE_ENV on PORT `);
});
