const event = (event, message) =>{
    return `{"event": "${event}", "message": "${message}"}`
}

module.exports = {
    event
}