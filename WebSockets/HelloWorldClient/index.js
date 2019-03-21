const WebSocket = require('ws');
var TalkCount = 0;
const TalkLimit = 5;

console.log("ws included");
var ws = new WebSocket('ws://localhost:8080');
ws.on("open", onOpened.bind(ws));
ws.on("message", onMessage.bind(ws));
ws.on("close", onClosed.bind(ws));

function onOpened() {
    console.log("opened");
    setTimeout(sendScheduled.bind(this), 1500);
};

function onMessage(message) {
    console.log("Received: '" + message + "'");
};

function onClosed() {
    console.log("Closed");
};

function sendScheduled() {
    if (!this) {
        return;
    }
    if (this.readyState!=this.OPEN) {
        return;
    }
    var ClientText = "Client talks (" + TalkCount + ")";
    this.send(ClientText);
    console.log("Sent: " + ClientText);
    if (TalkLimit > TalkCount) {
        setTimeout(sendScheduled.bind(this), 1500);
    } else {
        ws.close();
    }
    TalkCount++;
};
