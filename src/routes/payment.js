const express = require('express');
const router =express.Router();
const paymentControllers= require('../api/controllers/PaymentController');

router.post('/create',paymentControllers.create);
router.get('/result',paymentControllers.result);
router.post('/buy',paymentControllers.buy);
router.get('/result_buy',paymentControllers.result_buy);
router.post('/coin',paymentControllers.coin);

router.post('/pr1',paymentControllers.pr1);
router.get('/result_pr1',paymentControllers.result_pr1);




module.exports = router;
