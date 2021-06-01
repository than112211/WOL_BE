const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema({
    id : Schema.Types.ObjectId,
    id_learner:Schema.Types.ObjectId,
    id_lecture: Schema.Types.ObjectId,
    id_talker: Schema.Types.ObjectId,
    content:String,
    report_templete:String,
    date_create:{type: Date,
      default: Date.now }
  })
  
  module.exports= mongoose.model('Report', Report);
