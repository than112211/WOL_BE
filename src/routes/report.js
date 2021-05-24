const express = require('express');
const router =express.Router();
const reportControllers= require('../api/controllers/ReportController');

router.post('/create/:id',reportControllers.create);






module.exports = router;
