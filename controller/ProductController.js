'use strict';
const ProductService = require('../services/ProductService');

const ProductController = {
  productList: async function (req, res) {
    try {
      const select = {
        _id: 0,
        productId: '$_id',
        amount: 1,
        description: 1,
      };
      const data = await ProductService.getProducts({}, select);
      return res.status(200).json(data);
    } catch (e) {
      const response = {
        msg: 'Something went wrong',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
};

module.exports = ProductController;
