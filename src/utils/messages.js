const generateMessage = (username,message) => {
    const createdAT = new Date().getTime()
    return {
        username,
        message,
        createdAT
    }
}
const genereteLocationMessage = (username,url) => {
    const createdAT = new Date().getTime()
    return {
        username,
        url,
        createdAT
    }
}
module.exports = {
    generateMessage,
    genereteLocationMessage
}