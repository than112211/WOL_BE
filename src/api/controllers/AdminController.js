const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Quizz = require('../models/quizz')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGIRD_KEY)

class AdminController{
  
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
            html: `<h4>Xin chào ${req.body.name},</h4>
            <p>Chúc mừng bạn trở thành thành viên WOL.
            Bạn có thể đăng nhập dễ dàng vào tài khoản WOL để </p>`,
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