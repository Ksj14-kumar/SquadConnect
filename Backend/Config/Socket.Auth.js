const ParseCookieFromSessionSocket = require("../middleware/ParseCookieFromSessionSocket")
const User = require("../db/User")
const JWT = require("jsonwebtoken")
const EVENTS = require("../Socket/socket.events")
module.exports.SocketAuth = async function (socket, next) {
    const userInSession = socket.request.session.passport
    if (userInSession) {
        const cookieString = socket.handshake.headers.cookie
        const parseCookie = ParseCookieFromSessionSocket(cookieString)
        console.log({ parseCookie })
        if (parseCookie.tt) {
            try {
                const verifyToken = JWT.verify(parseCookie.tt, process.env.JWT_SECRET)
                if (verifyToken._id) {
                    //find user details
                    const userDetails = await User.findById({ _id: verifyToken._id })
                    console.log({ userDetails })
                    if (userDetails) {
                        next()
                    }
                    else {
                        socket.emit(EVENTS.LOGOUT, 401)
                    }
                }
            } catch (err) {
                console.log({ err })
            }
        }
        else {
            socket.emit(EVENTS.LOGOUT, 401)
        }
    }
}