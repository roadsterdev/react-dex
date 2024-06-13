const { server } = require('./sockets');
require('./sockets/dexSocket');
require('./sockets/clientSocket');


const { receiveFromRabbitMQ } = require('./rabbitmq');

server.listen(3000, () => {
    console.log("Server is running on port 3000");
    receiveFromRabbitMQ();
});
