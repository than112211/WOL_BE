const express = require('express');
const router =express.Router();
const liveController= require('../api/controllers/LiveStream');

router.post('/create',liveController.create);
router.post('/join/:id',liveController.join);



module.exports = router;
