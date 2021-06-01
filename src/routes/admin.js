const express = require('express');
const router =express.Router();
const adminController= require('../api/controllers/AdminController');

router.get('/user/all',adminController.all);
router.post('/user/search',adminController.search);
router.post('/ban',adminController.ban);
router.post('/checkban',adminController.checkban);
router.post('/edit/:id',adminController.edit);
router.post('/user/delete',adminController.delete);



module.exports = router;
