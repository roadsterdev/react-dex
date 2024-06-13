const amqp = require('amqplib/callback_api');

const connectRabbitMQ = (callback) => {
    amqp.connect('amqp://127.0.0.1:5672/', (error, connection) => {
        if (error) {
            throw error;
        }
        connection.createChannel((error, channel) => {
            if (error) {
                throw error;
            }
            callback(channel);
        });
    });
};

module.exports = { connectRabbitMQ };
