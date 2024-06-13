const socketIOClient = require("socket.io-client");
const { hasValue } = require('../util/checkHasValue');
const { sendToRabbitMQ } = require('../rabbitmq');
const eventBus = require('./../util/eventBus');


const dexSocket = socketIOClient.connect('https://socket.dex-trade.com');

let currentPairId = 1041

dexSocket.on('connect', function () {
    dexSocket.emit('subscribe', { type: 'book', event: 'book_1041' });
    dexSocket.emit('subscribe', { type: 'graph', event: 'BTCUSDT:60:1041' });
    dexSocket.emit('subscribe', { type: 'hist', event: 'hist_1041' });
});

eventBus.on('pair_changed', (selectedPair) => {
    if (selectedPair !== currentPairId) {
        dexSocket.emit('unsubscribe', `book_${currentPairId}`);
        dexSocket.emit('subscribe', { type: 'book', event: `book_${selectedPair}` });

        dexSocket.emit('unsubscribe', `hist_${currentPairId}`);
        dexSocket.emit('subscribe', { type: 'hist', event: `hist_${selectedPair}` });

        currentPairId = selectedPair
    }
});

dexSocket.on('message', function (ms) {
    const data = ms[0];
    if (data) {
        const { type, data: nestedData } = data;
        if (type === 'graph' || type === 'hist') {
            sendToRabbitMQ(data, type);
        } else if (type === 'book' && hasValue(nestedData)) {
            sendToRabbitMQ(nestedData, type);
        }
    }
});


module.exports = { dexSocket };
