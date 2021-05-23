const express = require('express');
const router =express.Router();
const userControllers= require('../api/controllers/UserController');
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


router.post('/login',userControllers.login);
router.post('/changepassword',userControllers.changepassword);
router.post('/resetpassword',userControllers.resetpassword); // yêu cầu cấp lại mk
router.get('/recieve',userControllers.recieve); // nhận lại mk
router.post('/register',userControllers.register);
router.put('/update',userControllers.update);
router.get('/me',userControllers.me);
router.post('/logout',userControllers.logout);
router.post('/logoutall',userControllers.logoutall);
router.get('/detail/:id',userControllers.user);
router.post('/avartar',upload.single('avartar'),userControllers.avartar);

// router.get('/verify',authControllers.verify);
module.exports = router;
