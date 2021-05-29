const express = require('express');
const router =express.Router();
const adminController= require('../api/controllers/AdminController');

router.get('/user/all',adminController.all);
router.post('/user/search',adminController.search);

router.post('/user/delete',adminController.delete);



module.exports = router;
