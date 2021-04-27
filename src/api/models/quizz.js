const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Quizz= new Schema({
    id: Schema.Types.ObjectId,
    id_lecture:Schema.Types.ObjectId,
    number_question:Number,
    active:Boolean,
    questions:[
        {
                question:String,
                answer1:
                {char:String,
                istrue:{type: Boolean,
      default: false},
                },
                answer2:
                {char:String,
                istrue:{type: Boolean,
      default: false},
                },
                answer3:
                {char:String,
                istrue:{type: Boolean,
      default: false},
                },
                answer4:
                {char:String,
                istrue:{type: Boolean,
      default: false},
                }
        }
    ]
  });

  module.exports= mongoose.model('Quizz', Quizz);
