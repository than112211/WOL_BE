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
                            console.log(req.body)
                            req.body.id_learner= user._id
                            req.body.id_lecture = lecture._id
                            req.body.id_talker = talker._id
                            user.reported = user.reported + 1
                            talker.reported = talker.reported + 1
                              const msg = {
                                to: talker.email, // Change to your recipient
                                from: 'thannguyenle77@gmail.com', // Change to your verified sender
                                subject: 'Bạn đã nhận báo cáo vi phạm từ người dùng trong hệ thống giảng dạy tiếng anh WAOEL',      
                                html: `<h4> HỆ THỐNG HỌC TIẾNG ANH TRỰC TUYẾN WAOEL </h4>
                                <h4>Xin chào ${talker.name},</h4>
                                <p> Chúng tôi muốn gửi thông báo đến bạn rằng tài khoản của bạn đã bị nhận được báo cáo không tốt về người dùng</p>
                                <p>Nội dung : ${req.body.report_templete},${req.body.content}</p>
                                </br><p>Tài khoản của bạn sẽ được chúng tôi xem xét và đánh giá trong thời gian tới</p>
                                </br><p>Để tránh những rủi ro không đáng có, xin hãy thực hiện theo các bước sau:</p>
                                </br><p>1. Đảm bảo nội dụng video bài học của bạn phải có liên quan đến các bài học tiếng anh</p>
                                </br><p>2. Đảm bảo chất lượng video hình ảnh và âm thanh không bị vi phạm bản quyền của bên thứ ba</p>
                                </br><p>2. Đảm bảo chất lượng video hình ảnh và âm thanh phải rõ nét và ổn định và dễ nhìn</p>
                                </br><p>3. Đảm bảo sau các video bài học phải có các bài tập chất lượng cho học giả</p>
                                </br>
                                </br><p>Mọi thắc mắc, hay khiếu nại hãy liên hệ với chúng tôi qua email: thannguyenle77@gmail.com để được tư vấn và giải đáp các thắc mắc</p>`
                                ,
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
    learner(req,res,next){
       
        Report.find({id_learner: req.body.id})
        .then(report => 
                res.json(report))
        .catch(next)
    }
    talker(req,res,next){
       
        Report.find({id_learner: req.body.id})
        .then(report => 
                res.json(report))
        .catch(next)
    }
    
   
  
}
module.exports = new ReportController;