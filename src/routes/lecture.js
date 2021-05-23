const express = require('express');
const router =express.Router();
const lectureControllers= require('../api/controllers/LectureController');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './src/resourses/')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})
router.post('/create',upload.single('video'),lectureControllers.create);
router.get('/all',lectureControllers.all);
router.put('/like/:id',lectureControllers.like);
router.put('/dislike/:id',lectureControllers.dislike);
router.get('/me',lectureControllers.me);
router.get('/me/:id',lectureControllers.detail);
router.get('/myvideo/:id',lectureControllers.myvideo);
router.get('/leaner/me',lectureControllers.myvideolearner);
router.post('/edit/:id',lectureControllers.edit);
router.delete('/delete/:id',lectureControllers.delete);






module.exports = router;
