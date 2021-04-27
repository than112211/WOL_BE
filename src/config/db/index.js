const mongoose = require('mongoose');
require('dotenv').config()
const URI =process.env.MONGGO_URI;

async function connect(){

    try {
        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
           
        });
        console.log('Monggoo connected')
        
    } catch (error) {
        console.log('Monggo connect fail')
    }

}

module.exports={connect};