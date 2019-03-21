//var wsUri = "wss://echo.websocket.org/";
var wsUri = "ws://localhost:8080";

function init() {
  testWebSocket();
}

function testWebSocket() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) {
    onOpen(evt);
  };
  websocket.onclose = function(evt) {
    onClose(evt);
  };
  websocket.onmessage = function(evt) {
    onMessage(evt);
  };
  websocket.onerror = function(evt) {
    onError(evt);
  };
}

function onOpen(evt) {
  writeToScreen("CONNECTED");
  doSend("Web Sockets don't rock");
}

function onClose(evt) {
  writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
  console.log(evt.data);
  let data = JSON.parse(evt.data);
  if (data.sensor === "piTemperatur") {
    let piTemperatur = document.getElementById("piTemperatur");
    piTemperatur.innerText = data.value;
  } else {
    writeToScreen('<span style="color: red;">RESPONSE:</span> ' + data);
  }
  //websocket.close();
}

function onError(evt) {
  writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
  writeToScreen("SENT: " + message);
  websocket.send(message);
}

function writeToScreen(message) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  document.getElementById("output").appendChild(pre);
}

window.addEventListener("load", init, false);
