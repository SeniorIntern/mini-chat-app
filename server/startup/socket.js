const error = require('../middleware/error');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

module.exports = function (app) {
  app.use(cors());

  // use variable io to establish the connection
  const server = http.createServer(app);

  // allows a server to indicate any origins. avoid problems later on
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // socket.io works based on events. we emit an event (from front-end) and then detact.
  // listen for an event (listen for: connection).
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // listen for join_room event. set data as perimeter
    socket.on('join_room', (data) => {
      socket.join(data);
      console.log(`user with id: ${socket.id} joined the room ${data}`);
    });

    // emit the message to all the users in the room
    socket.on('send_message', (data) => {
      socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
    });
  });

  app.use(error);
};
