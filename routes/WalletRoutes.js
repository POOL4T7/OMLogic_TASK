'use strict';
const express = require('express');
const router = express.Router();
const WalletController = require('../controller/WalletController');

router.route('/').post(WalletController.setUpWallet);
router.route('/:walletId').get(WalletController.walletDetails);
router.route('/:walletId/purchase').post(WalletController.purchaseProduct);
router
  .route('/:walletId/transaction')
  .post(WalletController.creditWallet)
  .get(WalletController.getWalletTransction);

module.exports = router;
