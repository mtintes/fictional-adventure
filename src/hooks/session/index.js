const {createEvent} = require("../../utils/events")
const {nanoid, customAlphabet} = require('nanoid')
const alphabet = require('alphabet')

const createSession = () => {
    const nanoid = customAlphabet(alphabet.upper.join(''),4)
    const gameId = nanoid()

    return gameId
}

const registerUser = (state, user) => {
    // state.sendAll(createEvent("TEST-ALL", user.message))
    state.send(user.message, createEvent("TEST-USER", user.message))
    // const existingUser = state.pub.get(`user-${userId}`)
    // if(!existingUser){
    //     state.pub.set(`user-${userId}`, `{userID: ${userId}}`)
    //     console.log("redis-user", state.pub.get(`user-${userId}`))  
    // }else{
    //     state.ws.send(event("TEST", "Testing"))
    //     console.log("existingUser")
    // }

}

module.exports = {
    createSession,
    registerUser
}