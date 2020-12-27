const {createEvent} = require('../../utils/events')

const doThing = (state, message) => {
    console.log("got command")
    // state.ws.send(event("COMMAND", `${message.message}`))
    // state.sendAll(createEvent("COMMAND-ALL", `${message.message}`))
}

module.exports= {doThing}