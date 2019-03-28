const urlBroker = 'mqtt:192.168.0.252';
//const urlBroker='mqtt://broker.hivemq.com';
const mqtt = require('mqtt')
const client = mqtt.connect(urlBroker);

client.on('connect', onConnected);
client.on('message', onMessage);

function onConnected() {
    console.log("connected to broker " + urlBroker);
    client.subscribe('garage/open')
    client.subscribe('garage/close')
}

function onMessage(topic, message) {
    console.log("topic: " + topic + ", message: " + message);
    console.log("");
}
