const WebSocket = require('ws');
const Redis = require('ioredis');
const {processEvent} = require('./src/hooks/');
const {nanoid} = require('nanoid');
const {createEvent} = require('./src/utils/events')
const {createSession} = require('./src/hooks/session');
const { join } = require('alphabet');

const wss = new WebSocket.Server({ port: 3005 });
const sub = new Redis({  host: 'localhost', port: 6379 });
const pub = new Redis({  host: 'localhost', port: 6379 });
const state = {
    wsClients: [],
    rooms:[]
}

state.sendAll = (event) => {
    for(client in state.wsClients){
        // console.log("client: ", client)
        state.wsClients[client].ws.send(event)
    }
}

state.send = (userId, event) => {
    state.wsClients[userId].ws.send(event)
}

state.sendRoom = (roomId, event) => {
    // console.log('sendRoom', roomId)
    // console.log('wsClients', state.wsClients)

    for(properties in state.wsClients){
        if(state.wsClients[properties].room === roomId){
            state.wsClients[properties].ws.send(event)
        }
        
    }
}

function parseRoom(message){
    const joinGameRegex = /join game (\w{4})/i;
    const id = message.match(joinGameRegex)
    // console.log("matches:", id)
    return id[1];
}

wss.on('connection', function connection(ws) {

    state.pub = pub;

    ws.on('message', function incoming(message) {
        const event = JSON.parse(message)

        // console.log("user: ", event.userId)
        // console.log("client: ", state.wsClients[event.userId])

        if(event.event === 'USERID'){
            // console.log("new client", event.message)
            const client = {userId: event.message, room: "", ws:ws}
            state.wsClients[event.message] = client
            // console.log("clients" , state.wsClients[event.message])
            // state.clients.push({room: "", ws: ws})
            // console.log("number of clients:", state.wsClients.length)
        }else if(state.wsClients[event.userId].room === '' && event.message.includes("create game")){
            const roomId = createSession()
            state.rooms.push(roomId)
            // state.send(event.userId, createEvent("ROOM", sessionId))
            state.wsClients[event.userId].room = roomId
            // console.log("client roomid", state.wsClients[event.userId].room)
            state.send(event.userId, createEvent("ROOMJOIN", roomId))
            // state.sendRoom(roomId, createEvent("TEST-ROOM", roomId))
        }else if(state.wsClients[event.userId].room === '' && event.message.includes("join game")){
            const roomId = parseRoom(event.message)
            if(roomId){
                // console.log("roomId", roomId)
                const exisitingRoom = state.rooms.indexOf(roomId)
                // console.log("existing room:", exisitingRoom)
                // console.log("current rooms", state.rooms)
                if(exisitingRoom >= 0){
                    state.wsClients[event.userId].room = roomId
                    state.sendRoom(roomId, createEvent("TEST-ROOM", roomId, {try: "test"}))
                }else{
                    state.send(event.userId, createEvent("ERROR", "I couldn't find that room. Could you try it again?"))
                }
            }else{
                state.send(event.userId, createEvent("ERROR", "We couldn't figure out what room you meant. Try 'create room <4-digit-code>'"))
            }
        }else if(event.message.includes("leave game")){
            // console.log('left game')
            state.wsClients[event.userId].room = ''
            state.send(event.userId, createEvent("GAMEEXIT", ''))
        }

        processEvent(state, JSON.parse(message))
    });

    sub.subscribe("test", (err, count) => {
        // connection.socket.send("test channel connection come back.")
        // pub.publish("test", "Hello world!");
        // console.log("subscribed")
    });

    sub.on("message", (channel, message) => {
        processEvent(state, JSON.parse(message))
        // console.log("Receive message %s from channel %s", message, channel);
        // ws.send("message" + message)
    });

});

