const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Quizz = require('../models/quizz')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGIRD_KEY)

class AdminController{

    edit(req,res,next) {
        User.findOne({_id: req.params.id })
    .then(user => {
       if( req.body.password == user.password) {
        User.updateOne({_id:req.params.id},{
            email:req.body.email,
            coin:parseInt(req.body.coin),
            phone:req.body.phone,
            password:req.body.password

        })
        .then(() =>{
            res.json('Đã cập nhật')
        })
        }
        else {
            bcrypt.hash(req.body.password,10,(err,hash) => {
                User.updateOne({_id:req.params.id},{
                    email:req.body.email,
                    coin:parseInt(req.body.coin),
                    phone:req.body.phone,
                    password:hash
        
                }) 
                .then(() => {
                    res.json('Đã cập nhật')
                })
            })
        
       }
    })
    .catch(next)
    }
    all(req,res,next){
        User.find({})
            .then(user => {
                res.json(user)
            })
            .catch(next)
    }
    search(req,res,next){
        console.log(req.body.type)
        if(req.body.type){
            User.find({_id: req.query.name})
            .then(user => {
                res.json(user)
            })
            .catch(next)
        }
        else {
            User.find({email:  {$regex : new RegExp (req.query.name,'i')}})
            .then(user => {
                res.json(user)
            })
            .catch(next)
        }
    }
delete(req,res,next) {
    User.deleteOne({_id: req.body.id })
    .then(() => {
        res.json("Deleted")
    })
    .catch(next)
}
ban(req,res,next) {
    User.findOne({_id: req.body.id })
    .then(user => {
       if(user.ban.baned) {
        res.json(`Tài khoản này đang bị khóa`)
       }
       else {
        user.ban.baned = true
        user.ban.day = req.body.day
        user.ban.start = Date.now()
        user.save()
        const msg = {
            to: user.email, // Change to your recipient
            from: 'thannguyenle77@gmail.com', // Change to your verified sender
            subject: 'Tài khoản WOL đã bị khóa',      
            html: `<h4> HỆ THỐNG HỌC TIẾNG ANH TRỰC TUYẾN WAOEL </h4>
                <h4>Xin chào tài khoản ${user.name},</h4>
                <p>Bạn sẽ bị khóa ${req.body.day} ngày , bắt đầu từ ${Date.now()}</p>
                <p>Chúng rất tiếc phải thông báo đến bạn rằng tài khoản của bạn đã bị khóa do vi phạm một trong số điều sau đây: </p>
                </br><p>1. Nhiều nội dụng video bài học của bạn không liên quan đến các bài học tiếng anh</p>
                </br><p>2. Nhiều nội dụng video bài học của bạn bị vi phạm bản quyền của bên thứ ba</p>
                </br><p>2. Nhiều nội dụng video bài học của bạn không rõ nét và ổn định và dễ nhìn</p>
                </br>
                </br><p>Mọi thắc mắc, hay khiếu nại hãy liên hệ với chúng tôi qua email: thannguyenle77@gmail.com để được tư vấn và giải đáp các thắc mắc</p>`
                ,
          }
        sgMail.send(msg)
        res.json(`Đã khóa tài khoản ${user.email} ${req.body.day} ngày`)
       }
    })
    .catch(next)
}
checkban(req,res,next) {
    const token = req.header('auth-token')
    const data = jwt.verify(token, process.env.JWT_KEY)
    User.findOne({email:data.email,token:token})
    .then(user => {
       if(user.ban.baned){
        const ONE_DAY = 1000 * 60 * 60 * 24;
        let differenceMs = Math.abs(user.ban.start - Date.now());
            if(Math.round(differenceMs / ONE_DAY) >= user.ban.day){
                user.ban.baned = false
                user.save()
                res.json(false)
            }
            else res.json(true)
       }
       else res.json(false)
    })
    .catch(next)
}
}
module.exports = new AdminController;