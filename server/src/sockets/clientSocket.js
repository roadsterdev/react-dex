const { clientSocket } = require("./");
const eventBus = require("./../util/eventBus");

clientSocket.on("connection", (socket) => {
  socket.on("pair_changed", (selectedPair) => {
    eventBus.emit("pair_changed", selectedPair);
  });
});
