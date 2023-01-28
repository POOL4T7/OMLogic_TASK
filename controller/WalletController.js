'use strict';
const WalletService = require('../services/WalletService');
const ProductService = require('../services/ProductService');

const WalletController = {
  setUpWallet: async function (req, res) {
    try {
      const { balance, name } = req.body;
      const data = await WalletService.addWallet({
        balance: balance.toFixed(4),
        name,
      });
      const response = {
        walletId: data._id,
        balance: data.balance,
        tranactionId: data.tranactionId,
        name: data.name,
        date: data.createdAt,
      };
      return res.status(201).json(response);
    } catch (e) {
      const response = {
        msg: 'Something went wrong',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
  walletDetails: async function (req, res) {
    try {
      const filter = {
        _id: req.params.walletId,
      };
      const project = {
        walletId: '$_id',
        balance: 1,
        name: 1,
        createdAt: 1,
      };
      const data = await WalletService.getWallet(filter, project);
      return res.status(200).json(data);
    } catch (e) {
      const response = {
        msg: 'Something went wrong',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
  creditWallet: async function (req, res) {
    try {
      const walletId = req.params.walletId;
      const amount = req.body.amount.toFixed(4);
      const description = req.body.description;

      const data = await WalletService.updateWallet(
        walletId,
        amount,
        'credit',
        description
      );
      if (data) {
        return res.status(200).json(data);
      }
      return res.status(404).json({ msg: 'Wallet Not Found' });
    } catch (e) {
      const response = {
        msg: 'Something went wrong, Please try again later',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
  getWalletTransction: async function (req, res) {
    try {
      const filter = {
        walletId: req.params.walletId,
      };
      const select = {
        _id: 0,
        walletId: 0,
        transactionId: '$_id',
        balance: 1,
        description: 1,
        productId: 1,
        type: 1,
        createdAt: 1,
      };
      const sort = { _id: -1 };
      const page = Number(req.query.page) > 0 ? req.query.page : 1;
      const limit = req.query.limit || 20;
      const skip = (page - 1) * limit;
      const data = await WalletService.transactionList(
        filter,
        select,
        sort,
        skip,
        limit
      );
      return res.status(200).json(data);
    } catch (e) {
      const response = {
        msg: 'Something went wrong, Please try again later',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
  purchaseProduct: async function (req, res) {
    try {
      const walletId = req.params.walletId;
      const productId = req.body.productId;
      const description = req.body.description;

      const select = {
        amount: 1,
        _id: 0,
      };

      const products = await ProductService.getProducts(
        {
          _id: productId,
        },
        select
      );
      if (products.length > 0) {
        const { amount } = products[0];
        const wallet = await WalletService.getWallet(
          { _id: walletId },
          { balance: 1 }
        );
        if (wallet) {
          const { balance } = wallet;
          if (balance < amount || balance <= 1) {
            return res.status(422).json({ msg: 'Insufficent Balance' });
          }
        }
        const data = await WalletService.updateWallet(
          walletId,
          -amount,
          'debit',
          description,
          productId
        );
        return res.status(201).json(data);
      }
      return res.status(404).json({ msg: 'Product Not Found' });
    } catch (e) {
      const response = {
        msg: 'Something went wrong',
        error: e.message,
      };
      return res.status(500).json(response);
    }
  },
};

module.exports = WalletController;
