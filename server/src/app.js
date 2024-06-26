const server = require('./server');
require('./sockets/clientSocket');
require('./sockets/dexSocket');

const { receiveFromRabbitMQ } = require('./rabbitmq');

server.listen(3000, () => {
    console.log("Server is running on port 3000");
    receiveFromRabbitMQ();
});
