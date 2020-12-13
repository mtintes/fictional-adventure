const WebSocket = require('ws');
const Redis = require('ioredis');
const {processEvent} = require('./src/hooks/');
const {nanoid} = require('nanoid');

const wss = new WebSocket.Server({ port: 3005 });
const sub = new Redis({  host: 'localhost', port: 6379 });
const pub = new Redis({  host: 'localhost', port: 6379 });
const state = {
    clients:[]
}

state.sendAll = (message) => {
    for (var i=0; i<state.clients.length; i++) {
        state.clients[i].send(message);
    }
}

wss.on('connection', function connection(ws) {
    console.log("connected ws", ws)

    state.clients.push(ws)
    // ws.send(`{"event": "connect", "userId": "${nanoid()}"}`);

    state.ws = ws;
    state.pub = pub;

    ws.on('message', function incoming(message) {
        // console.log("recieved message", ws._transport)
    //   console.log('received ws: %s', message);
      processEvent(state, JSON.parse(message))
    //   pub.publish("test", message)
    });

    // pub.set("test", "test value")
    // ws.send('something');
    // ws.send('send something else')

    sub.subscribe("test", (err, count) => {
        // connection.socket.send("test channel connection come back.")
        // pub.publish("test", "Hello world!");
        console.log("subscribed")
    });

    sub.on("message", (channel, message) => {
        processEvent(state, JSON.parse(message))
        console.log("Receive message %s from channel %s", message, channel);
        // ws.send("message" + message)
    });

});

