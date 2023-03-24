const { allRooms } = require("../Socket/util/online.room.methods")
const { onJoin, onRoomCreate, onleaveRoom, onRemoveUserOnCloseTab, Messages, sendPingMessage, sendPingMessageStart, sendPingMessageStop, SentAdminInfo, kickOutUser, onRoomSearch } = require("../Socket/Controller/Socket.Controller")
const EVENTS = require("../Socket/socket.events")
let count = 0
const { SocketAuth } = require("./Socket.Auth")
const { SocketOptions } = require("../Socket/util/Socket.Option")
module.exports = (server, sessionMiddleware) => {
    const io = require('socket.io')(server, SocketOptions);
    //nameSpace rooms
    const chatRoom = io.of("/api/v1/chat")
    // !============================================Socket middlewares=======================
    chatRoom.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
    chatRoom.use(async (socket, next) => {
        SocketAuth(socket, next)
    })
    // !============================================Socket middleware end=======================
    chatRoom.on("connection", async (socket) => {
        count += 1
        console.log("a user is connected")
        console.log(count)
        // !=======================SEND All Rooms when user is connect==================
        socket.emit(EVENTS.ROOMS, allRooms)
        //!===============================CREATE ROOM===== ===============================
        socket.on(EVENTS.CREATE_ROOM, async ({ roomName, name, userID, members, pic, rId }) => {
            console.log({ roomName, name, userID, members, pic, rId })
            await onRoomCreate(roomName, name, userID, members, pic, rId, socket, chatRoom)
        })
        // !=================================JOIN ROOM======================
        socket.on(EVENTS.ON_JOIN, async (joinUser, callback) => {
            console.log("join room")
            const { roomID, roomName, name, pic, userID, sid } = joinUser
            console.log({ roomID, roomName, name, pic, userID, sid }, { callback })
            await onJoin(roomID, roomName, name, pic, userID, sid, socket, chatRoom, callback)
        })
        //!=================================LEAVE ROOM WHEN COMPONENT UNMOUNT===============
        socket.on(EVENTS.ON_LEAVE_ROOM, async (value) => {
            console.log({ value })
            await onleaveRoom(value, chatRoom, socket)
        })
        // !==================================REMOVE USER WHEN USER CLOSE WINDOW OR TAB-===================
        socket.on("disconnecting", async (value) => {
            console.log({ value })
            count -= 1
            console.log("disconnecting...")
            await onRemoveUserOnCloseTab(socket.id, socket, chatRoom)
        })
        // !DONE:=======================User Message Mechanism====================================================
        socket.on(EVENTS.MESSAGE_SEND, async (msg, callback) => {
            console.log({ msg })
            console.log({ callback })
            await Messages(msg, chatRoom, socket, callback)
        })
        // !========================================USER ADMIN INFO =============================================== /
        socket.on(EVENTS.ADMIN_INFO, async (params) => {
            console.log({ params })
            await SentAdminInfo(params, chatRoom, socket)
        })
        // !=====================================ON KICK OUT=======================================================
        socket.on(EVENTS.KICKOUT, async (value) => {
            console.log({ value })
            await kickOutUser(value, socket, chatRoom)
        })
        //! ============================ONTYPING -=============================
        socket.on(EVENTS.ON_TYPING_START, async (msg) => {
            console.log({ msg })
            await sendPingMessageStart(msg, socket, chatRoom)
        })
        socket.on(EVENTS.ON_TYPING_STOP, async (msg) => {
            console.log("stop")
            console.log({ msg })
            await sendPingMessageStop(msg, socket, chatRoom)
        })
        chatRoom.on("disconnect", (data) => {
            console.log(data)
            console.log(count)
            console.log("a user is left the room")
        })
    })
    module.exports = chatRoom
}