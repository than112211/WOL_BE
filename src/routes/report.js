const express = require('express');
const router =express.Router();
const reportControllers= require('../api/controllers/ReportController');

router.post('/create/:id',reportControllers.create);

router.post('/all/learner',reportControllers.learner);
router.post('/all/talker',reportControllers.talker);





module.exports = router;
