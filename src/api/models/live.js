const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Live= new Schema({
    id : Schema.Types.ObjectId,
    id_user:Schema.Types.ObjectId,
    title: String,
    joiner:[],
    liked:[],
    dislike:[],
    comments:[{
        user:Schema.Types.ObjectId,
        comment:String
    }],
    description:String,
    date_create:{type: Date,
      default: Date.now }
  })
  


  module.exports= mongoose.model('Live', Live);
