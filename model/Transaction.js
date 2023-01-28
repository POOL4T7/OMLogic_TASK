const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Wallet',
    },
    balance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
