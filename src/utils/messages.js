const generate_message = (username , text)=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
const generate_loc_messages = (username , url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generate_message,
    generate_loc_messages
}