'use strict';
const Transaction = require('../model/Transaction');

const TransactionService = {
  getTransactions: async function (filter, select) {
    let data;
    try {
      data = await Transaction.find(filter).select(select);
    } catch (e) {
      throw Error(e.message);
    }
    return data;
  },
  addTranscation: async function (formData) {
    let data;
    try {
      const newTransaction = await Transaction(formData);
      data = newTransaction.save();
    } catch (e) {
      throw Error(e.message);
    }
    return data;
  },
};

module.exports = TransactionService;
