const Lecture = require('../models/lecture')
const User = require('../models/user')
const Report = require('../models/report')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Live = require('../models/live')
const Quizz = require('../models/quizz')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGIRD_KEY)
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
                   User.findOne({_id:lecture.id_user})
                   .then(talker =>{
                        if(report){
                            res.json('Bạn đã báo cáo cho bài học này trước đó')
                        }
                        else {
                            req.body.id_learner= user._id
                            req.body.id_lecture = lecture._id
                            user.reported = user.reported + 1
                            talker.reported = talker.reported + 1
                            const msg = {
                                to: talker.email, // Change to your recipient
                                from: 'thannguyenle77@gmail.com', // Change to your verified sender
                                subject: 'Bạn nhận đc báo cáo vi phạm từ',      
                                html: `<h4>Xin chào ${req.body.name},</h4>
                                <p>Chúc mừng bạn trở thành thành viên WOL.
                                Bạn có thể đăng nhập dễ dàng vào tài khoản WOL để </p>`,
                              }
                            sgMail.send(msg)
                            const report = new Report(req.body)
                            report.save();
                            user.save();
                            talker.save()
                            res.json('Báo cáo thành công')
                        }
                   })
               })
            })
        })
        .catch(next)
    
    }
   
  
}
module.exports = new ReportController;