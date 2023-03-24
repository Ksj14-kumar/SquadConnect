require("dotenv").config()
const PORT = process.env.PORT || 5700
require("./Config/dbConnection")
const express = require("express")
const app = express()
module.exports = app
const { error } = require('./middleware/ErrorHandler');
const { morgan, mongoose, helmet, fs, path, registerLoginRouter, bodyParser, passport, expressSession, mongoStore, cors, cookieParser, utl, resouces } = require("./lib/module");
const accessLog = fs.createWriteStream(path.join(__dirname, "/logger.log"), { flags: "a" })
const { strategy } = require("./middleware/Passport.middleware");
const server = require("http").createServer(app)
const sessionMiddleware = expressSession({
    name: "session",
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    store: mongoStore.create({
        mongoUrl: process.env.DB_URL || "mongodb://localhost:27017/messages",
        collectionName: "sessions",
        ttl: process.env.TTL
    }),
    cookie: {
        name: "session",
        maxAge: 86400000,
        httpOnly: true,
        // sameSite: "none",
        secure: false
    }
})
//===================Global Middleware start==============
app.use(express.static(path.join(__dirname, "view")))
app.use(express.static(path.join(__dirname, "Messagefile")))
app.use(cors({
    origin: process.env.UI_URL,
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization', "Access-Control-Allow-Credentials", "filePath"],
    allowedMethods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true
}))
app.use(helmet())
app.use(morgan("combined", { stream: accessLog }))
app.use(bodyParser.json({ limit: "200mb" }))
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }))
app.use(cookieParser())
app.use(sessionMiddleware)
strategy()
app.use(passport.initialize())
app.use(passport.session())
//===================Socket-Connection===============
require("./Config/Socket.room")(server, sessionMiddleware)
//=====================Socket-Connection-End==============
app.use("/api/v1/", registerLoginRouter)
app.use("/api/v1/resources", resouces)
app.get("/admin", async (req, res) => {
    return res.sendStatus(200)
})
app.get("*", async (req, res) => {
    return res.sendFile(path.join(__dirname, "view", "index.html"))
})
app.use(error)
//===================Global Middleware End==============
//=======================Logger===========
console.log = function (d) {
    fs.createWriteStream(path.join(__dirname, "/log.log"), { flags: "a" }).write(utl.format(d) + "\n")
    process.stdout.write(utl.format(d) + "\n")
}
//================Mongo Connection=============
mongoose.connection.once("open", (err) => {
    if (err) {
        console.log("err", err)
    }
    server.listen(PORT, (err) => {
        if (err) {
            console.log("not start at port")
        }
        console.log(`server is start at port ${PORT}`)
    })
})