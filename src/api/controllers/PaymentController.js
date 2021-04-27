const Lecture = require('../models/lecture')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const https = require('https');
const shortid = require('shortid');
const { resolveSoa } = require('dns');


require('dotenv').config()



class PaymentController{
    create(req,response,next) {
        var idOD = shortid.generate();
        const token = req.header('auth-token')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({email: data.email,token: token })
        .then(user=>{
    var rawSignature = "partnerCode="+process.env.PARTNER+"&accessKey="+process.env.ACCESSKEY+"&requestId="+user._id+"&amount="+req.body.money+"&orderId="+idOD+"&orderInfo=payment"+"&returnUrl=http://localhost:8080/payment/result"+"&notifyUrl=http://localhost:8080/payment/result"+"&extraData="
    var sign=  CryptoJS.HmacSHA256(rawSignature,process.env.SECRET_KEY)
     
    var body=  JSON.stringify(
    {
        "accessKey": process.env.ACCESSKEY,
        "partnerCode": process.env.PARTNER,
        "requestType": "captureMoMoWallet",
        "notifyUrl": "http://localhost:8080/payment/result",
        "returnUrl": "http://localhost:8080/payment/result",
        "orderId":String(idOD),
        "amount": String(req.body.money),
        "orderInfo": "payment",
        "requestId":user._id,
        "extraData": "",
        "signature": String(sign)
      })
      var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
       }
      }
    
      var reqe = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
          console.log('Body');
          console.log(body);
          console.log('URL');
          console.log(JSON.parse(body).payUrl);
          response.json({link:JSON.parse(body).payUrl})
        })
    })
      reqe.write(body);
      reqe.end();        
    })
    .catch(next)
    }

    
    result(req,res,next){
        User.findOne({_id:req.query.requestId})
        .then(user =>{
            if(req.query.errorCode==0){
                user.coin = user.coin + req.query.amount
                user.save()
                res.redirect('http://localhost:4200/')
            }
        })
        .catch(next)

    }
    buy(req,response,next) {
      var idB = shortid.generate();

      const token = req.header('auth-token')
      const data = jwt.verify(token, process.env.JWT_KEY)
      User.findOne({email: data.email,token: token })
      .then(user=>{
  var rawSignature = "partnerCode="+process.env.PARTNER+"&accessKey="+process.env.ACCESSKEY+"&requestId="+user._id+"&amount="+req.body.money+"&orderId="+idB+"&orderInfo=payment"+"&returnUrl=http://localhost:8080/payment/result_buy"+"&notifyUrl=http://localhost:8080/payment/result_buy"+"&extraData="+req.body.course_id
  var sign=  CryptoJS.HmacSHA256(rawSignature,process.env.SECRET_KEY)
   
  var body=  JSON.stringify(
  {
      "accessKey": process.env.ACCESSKEY,
      "partnerCode": process.env.PARTNER,
      "requestType": "captureMoMoWallet",
      "notifyUrl": "http://localhost:8080/payment/result_buy",
      "returnUrl": "http://localhost:8080/payment/result_buy",
      "orderId":String(idB),
      "amount": String(req.body.money),
      "orderInfo": "payment",
      "requestId":user._id,
      "extraData": req.body.course_id,
      "signature": String(sign)
    })
    var options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/gw_payment/transactionProcessor',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
     }
    }
  
    var reqe = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (body) => {
        console.log('Body');
        console.log(body);
        console.log('URL');
        console.log(JSON.parse(body).payUrl);
        response.json({link:JSON.parse(body).payUrl})
      })
  })
    reqe.write(body);
    reqe.end();        
  })
  .catch(next)
  }

  result_buy(req,res,next){
    User.findOne({_id:req.query.requestId})
    .then(user =>{
        if(req.query.errorCode==0){
            user.course_bought = user.course_bought.concat(req.query.extraData)
            user.save()
          Lecture.findOne({_id:req.query.extraData})
            .then(lecture => {
              lecture.bought = lecture.bought + 1
              lecture.save()
              User.findOne({_id:lecture.id_user})
                .then(teacher =>{
                    teacher.coin = teacher.coin + (lecture.price*0.8)
                    res.redirect('http://localhost:4200')
                    console.log(teacher)
                    console.log(lecture.price)
                    teacher.save()
              })
            })
        }
    })
    .catch(next)

}



pr1(req,response,next) {
  var idB = shortid.generate();
var rawSignature = "partnerCode="+process.env.PARTNER+"&accessKey="+process.env.ACCESSKEY+"&requestId="+idB+"&amount="+req.body.money+"&orderId="+idB+"&orderInfo=payment"+"&returnUrl=http://localhost:8080/payment/result_pr1"+"&notifyUrl=http://localhost:8080/payment/result_pr1"+"&extraData="
var sign=  CryptoJS.HmacSHA256(rawSignature,process.env.SECRET_KEY)

var body=  JSON.stringify(
{
  "accessKey": process.env.ACCESSKEY,
  "partnerCode": process.env.PARTNER,
  "requestType": "captureMoMoWallet",
  "notifyUrl": "http://localhost:8080/payment/result_pr1",
  "returnUrl": "http://localhost:8080/payment/result_pr1",
  "orderId":String(idB),
  "amount": String(req.body.money),
  "orderInfo": "payment",
  "requestId":idB,
  "extraData": "",
  "signature": String(sign)
})
var options = {
  hostname: 'test-payment.momo.vn',
  port: 443,
  path: '/gw_payment/transactionProcessor',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
 }
}

var reqe = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (body) => {
    console.log('Body');
    console.log(body);
    console.log('URL');
    console.log(JSON.parse(body).payUrl);
    response.json({link:JSON.parse(body).payUrl})
  })
})
reqe.write(body);
reqe.end();        

}

result_pr1(req,res,next){
    if(req.query.errorCode==0){
      res.redirect('http://127.0.0.1:5500/OE42-FE-PR1-Than/') 
}
}
   
coin(req,res,next){
  const token = req.header('auth-token')
  const data = jwt.verify(token, process.env.JWT_KEY)
  User.findOne({email: data.email,token: token }) 
   .then(user =>{
     console.log(user)
      if(user.coin >= req.body.money){
          user.course_bought = user.course_bought.concat(req.body.course_id)
          user.coin = user.coin - req.body.money
          user.save()
        Lecture.findOne({_id:req.body.course_id})
          .then(lecture => {
            lecture.bought = lecture.bought + 1
            lecture.save()
            User.findOne({_id:lecture.id_user})
              .then(teacher =>{
                console.log(teacher)
                  teacher.coin = teacher.coin + (lecture.price*0.8)
                  console.log(teacher)
                  console.log(lecture.price)
                  teacher.save()
                  res.json('TT thành công')

            })
          })
      }
      else res.json('het tien')
  })
  .catch(next)

}
}
module.exports = new PaymentController;