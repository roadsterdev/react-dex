const server = require('http').createServer();
const socketIO = require('socket.io');
const clientSocket = socketIO(server, {
  cors: {
    origin: '*',
  }
});

module.exports = { clientSocket, server };
