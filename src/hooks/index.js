const { registerUser} = require('./session')
const { doThing} = require('../hooks/command')

const processEvent = async (state, message) => {
    console.log("processeing", message.event)
    switch (message.event.toUpperCase()){
        case 'USERID':
            registerUser(state, message)
            break;
        case 'COMMAND':
            doThing(state, message)
            break;
    }
    // state.pub.set("key", "value")
    // const key = await state.pub.get("key")
    // console.log("key", key)
}

module.exports ={
    processEvent
}