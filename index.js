const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Enable CORS with all origins allowed
app.use(cors());

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
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
