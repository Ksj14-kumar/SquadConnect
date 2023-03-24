const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    email: { type: String },
    password: { type: String, required: true },
    name: String,
    provider: String,
    picture: String,
    verify: { type: Boolean, default: false }
})
module.exports = mongoose.model("Users", Schema)
