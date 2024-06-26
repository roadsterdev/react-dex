const socketIO = require('socket.io');
const eventBus = require('../util/eventBus');
const server = require('../server');

const clientSocket = socketIO(server, {
  cors: {
    origin: '*',
  }
});

clientSocket.on("connection", (socket) => {
  socket.on("pair_changed", (selectedPair) => {
    eventBus.emit("pair_changed", selectedPair);
  });
});

module.exports = clientSocket;