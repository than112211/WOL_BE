const Lecture = require('../models/lecture')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Quizz = require('../models/quizz')
require('dotenv').config()

class QuizzController{
    index(req,res,next){
        Quizz.findOne({_id: req.params.id })
        .then(quizz => {
            res.json(quizz)
        })
        .catch(next)
    }
    create(req,res,next) {
                req.body.id_lecture=req.params.id
                req.body.number_question = req.body.questions.length
                const quizz = new Quizz(req.body)
                quizz.save();
                res.json(req.body)
    }
    all(req,res,next){
        Quizz.find({id_lecture: req.params.id })
            .then(quizz => {
                res.status(200).json(quizz)
            })
            .catch(next)
    }
    edit(req,res,next) {
        req.body.number_question = req.body.questions.length
        Quizz.updateOne({_id:req.params.id} ,req.body) 
        .then(() => res.json({message:'Đã cập nhập'}))
    .catch(next)
}
active(req,res,next) {
    Quizz.findOne({_id: req.params.id })
    .then(quizz => {
        quizz.active = !quizz.active
        quizz.save()
        res.json(quizz.active)
    })
    .catch(next)
}
delete(req,res,next) {
    Quizz.deleteOne({_id: req.params.id })
    .then(() => {
       
        res.json("Deleted")
    })
    .catch(next)
}
}
module.exports = new QuizzController;