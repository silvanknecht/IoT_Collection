const WebSocket = require("ws");
const express = require("express");
const app = express();
const path = require("path");

/* HTTP SERVER */
let portnumHTTP = "3000";
let WSWORK = null;
// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));

// index
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// add the router
app.listen(process.env.port || portnumHTTP);
console.log(`Running at Port ${portnumHTTP}`);

/* Websocket Server */
var portnumWSS = "8080";

const wss = new WebSocket.Server({ port: portnumWSS });
console.log("Websocket created on port " + portnumWSS);

wss.on("connection", onConnectedWS.bind(wss));

var TalkCount = 0;
const TalkLimit = 5;

function onConnectedWS(socket, request) {
  WSWORK = socket;
  console.log(WSWORK.readyState);
  //console.log(this);
  /*    console.log("connected:");
        console.log(socket);
        console.log("request:");
        console.log(request);*/
  socket.on("message", onMessageWS.bind(socket));
  socket.on("close", onClosed.bind(socket));
  var me = this.address();
  console.log(
    "Connection" +
      socket._socket.remoteAddress +
      " -> " +
      me.address +
      ":" +
      me.port
  );
  setTimeout(onMessage.bind(socket), 1500);
  setTimeout(sendScheduled.bind(socket), 1500);
  //sendScheduled(socket);
}

function onMessageWS(message) {
  console.log("Received: '" + message + "'");
  this.send("Echo: " + message);
}

function onClosed() {
  console.log("Closed connection to " + this._socket.remoteAddress);
}

function sendScheduled() {
  if (!this) {
    return;
  }
  if (this.readyState != this.OPEN) {
    return;
  }
  let randomnum = Math.floor(Math.random() * (41 - 40 + 1)) + 41;
  let dezimal = Math.random().toFixed(2);
  let value = Number(randomnum) + Number(dezimal);
  this.send(JSON.stringify({ sensor: "piTemperatur", value: value }));
  console.log("Sent to " + this._socket.remoteAddress + ": " + value);
  setTimeout(sendScheduled.bind(this), 1000);
}

const urlBroker = "mqtt:192.168.0.252";
//const urlBroker='mqtt://broker.hivemq.com';
const mqtt = require("mqtt");
const client = mqtt.connect(urlBroker);

client.on("connect", onConnected);
client.on("message", onMessage);

function onConnected() {
  console.log("connected to broker " + urlBroker);
  client.subscribe("garage/open");
  client.subscribe("garage/close");
}

function onMessage(topic, message) {
  if (!this) {
    return;
  }
  if (this.readyState != this.OPEN) {
    return;
  }
  console.log(this.readyState);
  switch (topic) {
    case "garage/open":
      this.send(JSON.stringify({ sensor: "garageDoorIsOpen", value: true }));
      console.log("Garage is open");
      break;
    case "garage/close":
      this.send(JSON.stringify({ sensor: "garageDoorIsOpen", value: false }));
      console.log("Garage is closed");
      break;
  }
}

// Broadcast to all.
