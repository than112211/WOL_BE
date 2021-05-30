const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const shortid = require('shortid');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGIRD_KEY)

class UserController{


    register(req,res,next){
        User.findOne({email:req.body.email})
            .then(user =>{
                if(user){
                    res.json('Email đã đc sử dụng')
                    }
                else{
        bcrypt.hash(req.body.password,10,function(err,hashedPass){
            if(err){
                res.json({message:'Lỗi mã hóa'})
            }
            req.body.avatar ='/defaultAvartar.png'
            req.body.coin=0
            req.body.ban = {
                baned : false,
                day:0
            }
            req.body.reported=0
            req.body.follow=0
            req.body.password = hashedPass
            req.body.isVerify =false
            req.body.token= jwt.sign({email :req.body.email},process.env.JWT_KEY)                         
            const user = new User(req.body)
            user.save()
            // gữi email
            const msg = {
                to: user.email, // Change to your recipient
                from: 'thannguyenle77@gmail.com', // Change to your verified sender
                subject: 'Chào mừng thành viên đến với WOL',      
                html: `<h4>Xin chào ${req.body.name},</h4>
                <p>Chúc mừng bạn trở thành thành viên WOL.
                Bạn có thể đăng nhập dễ dàng vào tài khoản WOL để </p>`,
              }
            sgMail.send(msg)
            .then(() => res.json('Đăng kí thành công'))
            .catch(next)          
        })
    }})
    }

// POST user/login
    login(req,res,next){
        User.findOne({email:req.body.email})
        .then(user =>{
            if(user){
                bcrypt.compare(req.body.password,user.password,function(err,result){
                    if(err){
                        res.json({message:'Lỗi đăng nhập'})
                    }
                    if(result){
                       var token = jwt.sign({email: user.email},process.env.JWT_KEY)                         
                        res.json({message:'Đăng nhập thành công',token:token,role:user.role,admin:user.admin})
                        user.token=token
                        user.save()                
                    }
                    else  res.json({message:'Mật khẩu sai'})
                })
        

            }
            else  res.json({message:'Không tìm thấy'})
        })
        .catch(next)

    }
    // GET account/verify
    verify(req,res,next){
    }

    //PUT /account/:token
       // PUT là method để chỉnh sửa
       update(req,res,next) {
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.updateOne({email: data.email} ,req.body) // điều kiện , formdata là các bản ghi để sữa
        
        .then(() => res.json({message:'Đã cập nhập'}))
   
        .catch(next)
     
    }

    // GET account/me
    me(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
        .then(user => res.json(user) )
        .catch( next)
       
        
     }
     user(req,res,next){
        User.findOne({_id: req.params.id})
        .then(user => res.json(user) )
        .catch( next)
     }
     // POST account/logout  1 device
     logout(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
        // xóa token trùng với token đã đăng nhập ( truyền từng user.token vào tokenlogout sau đó kiểm tra kết quả trả về cho user.token)
        .then(user => { user.token=user.token.filter( (tokenlogout) => {return tokenlogout != token})
                        user.save()
                        res.json({message:'Đã đăng xuất'})
        })
        .catch(next)
     }

     // POST account/logout  all device
     logoutall(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
        // xóa tất cả token
        .then(user => { user.token.splice(0,user.token.length)
        user.save()
        res.json({message:'Đã đăng xuất khỏi tất cả thiết bị'})
        })
        .catch(next)
       
 
     }
     changepassword(req,res,next){
        
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
     
        .then(user => { 
            bcrypt.compare(req.body.oldpassword,user.password,function(err,result){
            if(result){
                bcrypt.hash(req.body.newpassword,10,function(err,hashedPass){
                    if(err){
                        res.json({message:'Lỗi đăng nhập'})
                    }
                    if(result){
                        user.password=hashedPass
                        user.save()
                        res.json({message:'Thay đổi thành công'})
                            }})
            }
            else res.json({message:'Mật khẩu cũ không đúng'})
       
        })
    })
        .catch(next)
       
 
     }

     resetpassword(req,res,next){
         
        User.findOne({email: req.body.email },function(err,user){
            if(!err){
                const msg = {
                    to: user.email, // Change to your recipient
                    from: 'than123456qwe@gmail.com', // Change to your verified sender
                    subject: 'Cấp lại mật khẩu Le Do Cinema',
                    text: 'Tìm mật khẩu',
                    html: `<a href="http://${req.headers.host}/account/recieve?email=${user.email}">Vui lòng kích vào đây để nhận lại mật khẩu,Nếu không phải bạn yêu cầu cấp lại mật khẩu thì không cần làm gì</a>`,
                  }
                sgMail.send(msg)
                res.json({message:'Vui lòng vào email để nhận lại mật khẩu'})
            }
            else
            res.json({message:'Không tìm thấy tài khoản'})
            
        })
     }
     recieve(req,res,next){
        User.findOne({email:req.query.email})
        .then(user => {
          var  password=shortid.generate()
            bcrypt.hash(password,10,function(err,hashedPass){
                if(!err){
                    user.password=hashedPass
                    res.json({message:'Mật khẩu mới là '+password})
                    user.save()
                }
                else
                res.json({message:'ko mã hóa đc mk'})

            })
                      
        })
     
          .catch(next)
     }
     //POST /account/avartar
     avartar(req,res,next){
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })    
        .then(user => { 
            user.avatar = req.file.path.split('\\').pop().split('/').pop()
            user.save()         
           res.json({message:'Đã cập nhập ảnh đại diện'})
        })
        .catch(next)
         
     
}
}
module.exports = new UserController;