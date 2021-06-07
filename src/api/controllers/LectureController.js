const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const lecture = require('../models/lecture')
const e = require('express')
require('dotenv').config()


class LectureController{
    create(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email:data.email,token:token}) // điều kiện , formdata là các bản ghi để sữa
        .then(user => {
            const file = req.file.path.split('.').slice(1,2)
            if( file == "mp3" || file ==  "mp4" ||  file == "flv" ||  file== "mov" || file == "wmv" || file =="avi"){
                req.body.id_user=user._id
            req.body.liked=[]
            req.body.dislike=[]
            req.body.bought=0
            req.body.video=req.file.path.split('\\').pop().split('/').pop()
            console.log(req.file.path)
            const lecture = new Lecture(req.body)
            lecture.save();
            res.json('Tạo thành công')
            }
            else {
                res.json('Vui lòng chọn file video')
            }
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
    
        Lecture.find({title : {$regex : new RegExp (req.query.name,'i')}},function(err,lecture){
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
            Lecture.find({id_user:user._id,title : {$regex : new RegExp (req.query.name,'i')}},function(err,lecture){
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
    delete(req,res,next) {
    Lecture.deleteOne({_id: req.params.id })
    .then(() => {
        res.json("Deleted")
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
                console.log(user.course_bought)
                let leanerCourse = []
                for (let i = 0 ; i < user.course_bought.length;i++){
                    Lecture.findOne({_id:user.course_bought[i],title : {$regex : new RegExp (req.query.name,'i')}}
                    )
                     .then(lecture =>{
                         console.log(lecture)
                        if(lecture !== null) {
                            console.log('runnnnnn')
                            leanerCourse.push(lecture)
                            if(leanerCourse.length == user.course_bought.length){
                                 res.json(leanerCourse)
                            }
                        }
                        else{
                            user.course_bought.splice(i,1)
                            user.save()
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