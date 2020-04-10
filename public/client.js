const ws = new WebSocket('ws://' + window.location.hostname + ':' + (window.location.port || 80) + '/');
const myid = Math.random().toString(36).substring(2);

function sendMessage() {
  const message = {
    newUser: false,
    id: myid,
    message: document.getElementById('user').value,
  };
  ws.send(JSON.stringify(message));
  document.getElementById('user').value="";
}

// this should run in response to any message
// received over the websocket
function receivedMessageFromServer(e) {
  // we receive a JSON string, need to parse it into an object
  const msg = JSON.parse(e.data);
  const messageArea = document.getElementById('messages');
  let p = document.createElement('p');
  if (msg.newUser === false){
    p.textContent = msg.id+": "+msg.message;
  }else{
    p.textContent = "New user joined ("+msg.id+")";
  }
  messageArea.appendChild(p);
}

function checkKey(e){
  const code = e.keyCode;
  const messageArea = document.getElementById('messages');
  if (e.keyCode === 13){
    sendMessage();
  }
}

function connectListeners() {
  document.getElementById('user').addEventListener('keydown', checkKey);
  ws.addEventListener('message', receivedMessageFromServer);
  const message = {
    newUser: true,
    id: myid,
    message: "",
  };
  ws.send(JSON.stringify(message));
}

window.addEventListener('load', connectListeners);
