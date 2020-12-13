const {event} = require('../../utils/events')

const doThing = (state, message) => {
    console.log("got command")
    state.ws.send(event("COMMAND", `${message.message}`))
    state.sendAll(event("COMMAND-ALL", `${message.message}`))
}

module.exports= {doThing}