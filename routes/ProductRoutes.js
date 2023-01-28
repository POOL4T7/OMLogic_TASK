'use strict';
const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');

router.route('/').get(ProductController.productList);

module.exports = router;
