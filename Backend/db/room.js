const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    roomName: String,
    roomId: String,
    members: String,
    admin: {
        name: String,
        isAdmin: Boolean,
        pic: String,
        time: Number,
        userID: String
    },
    userInRoom: [Object],
    messages: [Object]
})
module.exports = new mongoose.model("room", Schema)