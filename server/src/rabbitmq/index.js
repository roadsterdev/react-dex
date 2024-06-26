const { connectRabbitMQ } = require("./connect");
const clientSocket= require("../sockets/clientSocket");

const sendToRabbitMQ = (msg, type) => {
  connectRabbitMQ((channel) => {
    const queue = type;
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

    setTimeout(() => {
      channel.close();
    }, 500);
  });
};

const receiveFromRabbitMQ = () => {
  connectRabbitMQ((channel) => {
    const queue1 = "book";
    channel.assertQueue(queue1, { durable: false });
    channel.consume(
      queue1,
      (msg) => {
        clientSocket.sockets.emit("book", msg.content.toString());
      },
      { noAck: true }
    );

    const queue2 = "graph";
    channel.assertQueue(queue2, { durable: false });
    channel.consume(
      queue2,
      (msg) => {
        clientSocket.sockets.emit("graph", msg.content.toString());
      },
      { noAck: true }
    );
  });
};

module.exports = { sendToRabbitMQ, receiveFromRabbitMQ };
