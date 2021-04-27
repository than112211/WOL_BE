const express = require('express');
const router =express.Router();
const quizzControllers= require('../api/controllers/QuizzController');

router.get('/:id',quizzControllers.index);
router.post('/create/:id',quizzControllers.create);
router.get('/all/:id',quizzControllers.all);
router.put('/edit/:id',quizzControllers.edit);
router.post('/active/:id',quizzControllers.active);
router.delete('/delete/:id',quizzControllers.delete);





module.exports = router;
