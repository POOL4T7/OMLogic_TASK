'use strict';
const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Wallet', WalletSchema);
