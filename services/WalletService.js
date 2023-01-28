'use strict';
const Wallet = require('../model/Wallet');
const Transaction = require('../model/Transaction');
const mongoose = require('mongoose');

const WalletService = {
  getWallet: async function (filter, select) {
    let data;
    try {
      data = await Wallet.find(filter).select(select).lean();
      if (data.length > 0) {
        data = data[0];
      }
    } catch (e) {
      throw Error(e.message);
    }
    return data;
  },
  addWallet: async function (formData) {
    let data;
    try {
      const newModel = new Wallet(formData);
      data = await newModel.save();
    } catch (e) {
      throw Error(e.message);
    }
    return data;
  },
  updateWallet: async function (
    walletId,
    amount,
    type,
    description,
    productId = null
  ) {
    let data;
    const session = await mongoose.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    };
    try {
      session.startTransaction(transactionOptions);
      const walletData = {
        $inc: { balance: amount },
      };
      const walletResult = await Wallet.findOneAndUpdate(
        { _id: walletId },
        walletData,
        {
          new: true,
          multi: false,
          session: session,
        }
      );
      if (!walletResult) {
        await session.abortTransaction();
        return data;
      }
      const transactionData = {
        walletId: walletId,
        balance: Math.abs(amount),
        type: type,
      };
      if (description) {
        transactionData.description = description;
      }
      if (productId) {
        transactionData.productId = productId;
      }
      const transactionResult = await Transaction.create([transactionData], {
        session,
      });
      if (transactionResult.length > 0) {
        await session.commitTransaction();
        data = {
          balance: transactionResult[0].balance,
          transactionId: transactionResult[0]._id,
          type,
          description,
          createdAt: transactionResult[0].createdAt,
          productId: transactionResult[0].productId,
        };
      } else {
        await session.abortTransaction();
        throw Error('The transaction was intentionally aborted.');
      }
    } catch (e) {
      await session.abortTransaction();
      throw Error(
        'The transaction was aborted due to an unexpected error: ' + e.message
      );
    } finally {
      await session.endSession();
    }
    return data;
  },
  transactionList: async function (filter, select, sort, skip, limit) {
    let data;
    try {
      data = await Transaction.find(filter)
        .populate('walletId', 'name')
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (e) {
      throw Error('Try Again later' + e.message);
    }
    return data;
  },
};

module.exports = WalletService;
