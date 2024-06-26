const socketIOClient = require("socket.io-client");
const { hasValue } = require('../util/checkHasValue');
const { sendToRabbitMQ } = require('../rabbitmq');
const eventBus = require('./../util/eventBus');

const dexSocket = socketIOClient.connect('https://socket.dex-trade.com');

let currentPairKey = 1041

dexSocket.on('connect', function () {
    dexSocket.emit('subscribe', { type: 'book', event: 'book_1041' });
    dexSocket.emit('subscribe', { type: 'graph', event: 'BTCUSDT:60:1041' });
});

eventBus.on('pair_changed', (data) => {
    const selectedPair = JSON.parse(data)

    if (selectedPair.key !== currentPairKey) {
        dexSocket.emit('unsubscribe', `book_${currentPairKey}`);
        dexSocket.emit('subscribe', { type: 'book', event: `book_${selectedPair.key}` });

        dexSocket.emit('unsubscribe',  `${selectedPair.ticker}USDT:60:${selectedPair.key}`);
        dexSocket.emit('subscribe', { type: 'graph', event: `${selectedPair.ticker}USDT:60:${selectedPair.key}` });

        currentPairKey = selectedPair.key
    }
});

dexSocket.on('message', function (ms) {
    const data = ms[0];
    if (data) {
        const { type, data: nestedData } = data;
        const isGraphType = type === 'graph';
        const isBookType = type === 'book';
        const isCurrentPairKey = Array.isArray(nestedData) ? nestedData[0]?.pair_id === currentPairKey : nestedData.pair_id === currentPairKey;
        
        if (isGraphType && isCurrentPairKey) {
            sendToRabbitMQ(data, type);
        } else if (isBookType && hasValue(nestedData)) {
            sendToRabbitMQ(nestedData, type);
        }
    }
});


module.exports = { dexSocket };
