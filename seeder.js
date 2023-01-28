'use strict';

const Product = require('./model/Product');
const ProductData = require('./data/ProductData');
const mongoDB = require('./config/db');
mongoDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(ProductData);
    console.log('data imported');
    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
};
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('data destroy');
    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
