const createEvent = (event, message, options) =>{
    const response = {
        event: event,
        message: message,
        ...options
    }


    return JSON.stringify(response)
}

module.exports = {
    createEvent
}