const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lecture= new Schema({
    id : Schema.Types.ObjectId,
    id_user:Schema.Types.ObjectId,
    title: String,
    video:String,
    liked:[],
    dislike:[],
    description:String,
    price:Number,
    bought:Number,
    level:String,


    // comments: [{
    //   id_user:Schema.Types.ObjectId,
    //   comment:{
    //     comment:String,
    //     reply:{
    //       id_user:Schema.Types.ObjectId,
    //       comment:String
    //     }
    //   },
    // }],


    date_create:{type: Date,
      default: Date.now }
  })
  


  module.exports= mongoose.model('Lecture', Lecture);
