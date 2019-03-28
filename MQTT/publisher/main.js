const urlBroker = "mqtt:192.168.0.252";
//const urlBroker='mqtt://broker.hivemq.com';
const mqtt = require("mqtt");
const client = mqtt.connect(urlBroker);

var doorOpen = false;

client.on("connect", onConnect);

function onConnect() {
  console.log("connected to " + urlBroker);
  simulateDoor();
}

function openGarageDoor() {
  console.log("open door");
  client.publish("garage/open", "true");
}

function closeGarageDoor() {
  console.log("close door");
  client.publish("garage/close", "true");
}

function simulateDoor() {
  if (doorOpen) {
    closeGarageDoor();
    doorOpen = false;
  } else {
    openGarageDoor();
    doorOpen = true;
  }
  setTimeout(simulateDoor, 5000);
}
