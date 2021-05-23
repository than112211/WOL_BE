const express = require('express');
const app = express()
const port = 8080
const path = require('path')
const morgan = require('morgan');
const db=require('./config/db');
const route = require('./routes')
const cors = require('cors');
const server = require("http").Server(app);
const io = require("socket.io")(server);
// const { ExpressPeerServer} = require('peer');
// const peerServer = ExpressPeerServer(server,{
//   debug:true,
// })
const {PeerServer} = require('peer')
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

db.connect();
app.use(express.static(path.join(__dirname,'resourses')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended:true
}));
io.on('connection', socket => {
  console.log('co nguoi ket noi')
  socket.on('joinRoom',(roomID,userID) =>{
    console.log(userID)
      socket.join(roomID)
      socket.to(roomID).emit('user-connected',userID)
  })
});
app.use(morgan('combined'))
route(app);
server.listen(port, () => {
  console.log(`Access success http://localhost:${port}`)
})