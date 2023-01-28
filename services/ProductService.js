'use strict';
const Product = require('../model/Product');

const ProductService = {
  getProducts: async function (
    filter,
    select,
    sort = { _id: -1 },
    skip = 0,
    limit = 30
  ) {
    let data;
    try {
      data = await Product.find(filter)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (e) {
      throw Error(e.message);
    }
    return data;
  },
};

module.exports = ProductService;
