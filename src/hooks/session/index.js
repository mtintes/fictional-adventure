const {event} = require("../../utils/events")

const createSession = (redis) => {
    const nanoid = customAlphabet(alphabet.upper.join(''),4)
    const gameId = nanoid()

    return gameId
}

const registerUser = (state, userId) => {
    state.clients[userId] = state.ws
    const existingUser = state.pub.get(`user-${userId}`)
    if(!existingUser){
        state.pub.set(`user-${userId}`, `{userID: ${userId}}`)
        console.log("redis-user", state.pub.get(`user-${userId}`))  
    }else{
        state.ws.send(event("TEST", "Testing"))
        console.log("existingUser")
    }

}

module.exports = {
    createSession,
    registerUser
}