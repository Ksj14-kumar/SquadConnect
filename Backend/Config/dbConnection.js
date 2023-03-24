const { default: mongoose, mongo } = require("mongoose")
const DB_URI =  process.env.DB_URL || "mongodb://localhost:27017/messages"
mongoose.connect(DB_URI, (err) => {
    if (err) {
        console.log(err)
        console.log("not connect to db")
    }
    else {
        console.log("connected to db")
    }
})
