const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const server = http.createServer(app);

const users = {};

const io = socketIO(server);

io.origins('*:*');

io.on('connection', (socket) =>{
  
  console.log(socket.id);

  socket.on('join_room', (data) =>{
    socket.join(data);
    console.log(`User ${socket.id} joined Room ${data}`);
  });

  socket.on('send_message', (data) =>{
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', ()=>{
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 3001;

server.listen(port, ()=>{
  console.log("SERVER RUNNING");
})
