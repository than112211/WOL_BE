const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const lecture = require('../models/lecture')
require('dotenv').config()


class LectureController{
    create(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email:data.email,token:token}) // điều kiện , formdata là các bản ghi để sữa
        .then(user => {
            req.body.id_user=user._id
            req.body.liked=[]
            req.body.dislike=[]
            req.body.bought=0
            req.body.video=req.file.path.split('\\').pop().split('/').pop()
            const lecture = new Lecture(req.body)
            lecture.save();
            res.json(req.body)
        })
        .catch(next)
    }
    edit(req,res,next) {
        Lecture.updateOne({_id:req.params.id},req.body) // điều kiện , formdata là các bản ghi để sữa
        .then( ()=> {
           res.json('Đã cập nhật')
        })
        .catch(next)
    }
    all(req,res,next){
        Lecture.find({},function(err,lecture){
            if(!err)  {
                res.json(lecture);
            }
            else
            res.json({message:'Không tìm thấy'})
        });
    }
    me(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
        .then(user => 
            Lecture.find({id_user:user._id},function(err,lecture){
                    if(!err)
                        res.json(lecture)}))
        .catch(next)
    }


    detail(req,res,next){
        Lecture.findOne({_id: req.params.id})
            .then(lecture => {
                res.json(lecture)
            })
            .catch(next)

    }
    myvideo(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
            .then(user =>{
                var isMyCourse = false
                for(let i = 0 ; i<user.course_bought.length ; i++){
                    if(user.course_bought[i] == req.params.id)
                        isMyCourse = true
                }
                res.json({mycourse : isMyCourse})

            })
    }
   myvideolearner(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
          User.findOne({email: data.email,token: token })
            .then( user =>{
                var leanerCourse = []

               for (let i = 0 ; i < user.course_bought.length;i++){
                   Lecture.findOne({_id:user.course_bought[i]})
                    .then(lecture =>{
                        leanerCourse.push(lecture)
                        console.log('Đang tìm....')
                        if(leanerCourse.length == user.course_bought.length){
                            res.json(leanerCourse)
                        }
                    })
               }

            })
            .catch(next)
    }
    like(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        var check = 0;
        User.findOne({email: data.email,token: token })
            .then(user =>{  
            
                Lecture.findOne({_id:req.params.id})
                    .then(lecture =>{
                        if(lecture.like == undefined)
                         {   lecture.like=user._id
                            lecture.save()}
                        else {lecture.like.concat(user._id)
                            lecture.save()}
                    })
             
            })
        
        .catch(next)
    }
    dislike(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        var check = 0;
        User.findOne({email: data.email,token: token })
            .then(user =>{  
            
                Lecture.findOne({_id:req.params.id})
                    .then(lecture =>{
                        if(lecture.dislike == undefined)
                            {lecture.dislike=user._id
                                lecture.save()}

                        else {lecture.dislike.concat(user._id)
                            lecture.save()}

                    })
             
            })
        
        .catch(next)
    }
 
    
    

}
module.exports = new LectureController;