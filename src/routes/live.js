const express = require('express');
const router =express.Router();
const liveController= require('../api/controllers/LiveStream');

router.post('/create',liveController.create);
router.get('/all',liveController.all);
router.get('/join/:room',liveController.join);



module.exports = router;
