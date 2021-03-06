const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User= new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    avatar: String,
    phone:String,
    token:String,
    isVerify:Boolean,
    role:Boolean, // true là học sinh , false giáo viên
    follow:Number,
    reported:{type: Number,
      default:0 },
    email:String,
    password:String,
    gender:Boolean, // true là nam , false nữ
    dob:Date,
    ban:{
      baned:{type: Boolean,
        default: false },
      day:{type: Number,
        default:0 },
      start:{type: Date,
        default: Date.now }
    },
    coin:Number,
    admin:Boolean,
    course_bought:[],
  });



  module.exports= mongoose.model('user', User);
