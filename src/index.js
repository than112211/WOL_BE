const express = require('express')
const app = express()
const port = 8080
const path = require('path')
const morgan = require('morgan');
const db=require('./config/db');
const route = require('./routes')
const cors = require('cors');


db.connect();
app.use(express.static(path.join(__dirname,'resourses')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended:true
}));
app.use(morgan('combined'))
route(app);
app.listen(port, () => {
  console.log(`Access success http://localhost:${port}`)
})

