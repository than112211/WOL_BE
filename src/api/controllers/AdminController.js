const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Quizz = require('../models/quizz')
require('dotenv').config()

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
}
module.exports = new AdminController;