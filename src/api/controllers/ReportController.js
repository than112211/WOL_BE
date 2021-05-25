const Lecture = require('../models/lecture')
const User = require('../models/user')
const Report = require('../models/report')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Live = require('../models/live')
const Quizz = require('../models/quizz')
require('dotenv').config()

class ReportController{
  
    create(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email:data.email,token:token}) // điều kiện , formdata là các bản ghi để sữa
        .then(user => {
            Lecture.findOne({_id:req.params.id})
            .then(lecture => {
               Report.findOne({id_learner:user._id,id_lecture:lecture._id})
               .then(report =>{
                   if(report){
                    res.json('Bạn đã báo cáo cho bài học này trước đó')
                   }
                   else {
                    req.body.id_learner= user._id
                    req.body.id_lecture = lecture._id
                    const report = new Report(req.body)
                    report.save();
                    res.json('Báo cáo thành công')
                   }
               })
            })
        })
        .catch(next)
    
    }
   
  
}
module.exports = new ReportController;