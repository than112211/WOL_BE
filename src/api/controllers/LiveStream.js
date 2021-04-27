const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Live = require('../models/live')
const Quizz = require('../models/quizz')
require('dotenv').config()

class LivestreamController{
  
    create(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email:data.email,token:token}) // điều kiện , formdata là các bản ghi để sữa
        .then(user => {
            req.body.id_user=user._id
            req.body.joiner=user._id
            req.body.liked=[]
            req.body.dislike=[]
            const video = new Live(req.body)
            video.save();
            res.json(video)
        })
        .catch(next)
    
    }
    join(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email:data.email,token:token}) // điều kiện , formdata là các bản ghi để sữa
        .then(user => {
          
        })
        .catch(next)
    
    }
  
}
module.exports = new LivestreamController;