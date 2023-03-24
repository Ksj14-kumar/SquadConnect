const RoomDb = require("../../db/room")
const { allRooms, addUserInRoom, leaveRoom, onRemove, getUsersFromCurrentRoom, findRoomIndex, findUserSID, findUserIndexInRoom } = require("../util/online.room.methods")
const fs = require("fs")
const path = require("path")
const { detectFile } = require("../../Config/DetectFile")
const EVENTS = require("../socket.events")
const { fileAllow } = require("../util/BreakUnknowFile")
const { sendMessages } = require("./MessageController")
class Socket {
    async onRoomCreate(roomName, name, userID, members, pic, rId, socket, chatRoom) {
        const roomId = rId + roomName
        try {
            console.log({ roomName, name, userID, members, pic })
            const time = new Date().getTime()
            const newRoomInfo = {
                roomName,
                roomId,
                members,
                admin: {
                    name,
                    isAdmin: true,
                    pic,
                    time, userID
                },
                userInRoom: []
            }
            const newRoom = await RoomDb(newRoomInfo)
            newRoom.save(async (err, result) => {
                if (err) {
                    console.log(err)
                    socket.emit(EVENTS.ERROR_ON_ROOM_CREATION, "Oops's something error occured")
                    return 0
                }
                else {
                    allRooms.unshift(newRoomInfo)
                    chatRoom.emit(EVENTS.UPDATE_ROOM_ON_CREATE, newRoomInfo)
                    return 1
                }
            })
        } catch (err) {
            console.log("something error occured during room creation")
            console.log(err)
            socket.emit(EVENTS.ERROR_ON_ROOM_CREATION, err.message)
            return 0
        }
    }
    async onJoin(roomID, roomName, name, pic, userID, sid, socket, chatRoom, callback) {
        console.log(sid)
        console.log(roomID)
        console.log(chatRoom.adapter.rooms)
        const findRoom = findRoomIndex(roomName, roomID)
        if (findRoom !== -1) {
            if (chatRoom.adapter.rooms.get(roomID)) {
                try {
                    console.log(chatRoom.adapter.rooms.get(roomID), allRooms[findRoom].members)
                    if (allRooms[findRoom].members !== "unlimited" && +allRooms[findRoom].members === chatRoom.adapter.rooms.get(roomID).size) {
                        callback({ alert: "room is full", status: 400 })
                        return
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
        socket.join(roomID)
        const result = await addUserInRoom({ name, userID, pic, sid }, roomName, roomID)
        console.log({ result })
        const getAllUsersFromCurrentRoom = await getUsersFromCurrentRoom(roomName, roomID)
        if (result) {
            //Case-1, send message to all user which are already in room
            socket.to(roomID).emit(EVENTS.NEW_USER_ADDED, { ...result, roomName })
            // send me 
            socket.emit(EVENTS.ALL_USER_IN_CURRENT_ROOM, getAllUsersFromCurrentRoom)
            //Case-2, users, which are not in rooms
            chatRoom.except(roomID).emit(EVENTS.NEW_USER_ADDED_TO_ALL, result)
            callback({ alert: "ok", status: 200 })
        }
    }
    onleaveRoom = async (params, chatRoom, socket) => {
        const { roomId, roomName } = params
        console.log({ params })
        const removeUserFromRoom = await leaveRoom(params)
        const allUsersAfterSomeOneLeftRoom = await getUsersFromCurrentRoom(roomName, roomId)
        console.log({ allUsersAfterSomeOneLeftRoom })
        console.log({ removeUserFromRoom })
        console.log("berofre")
        console.log(chatRoom.adapter.rooms)
        if (removeUserFromRoom) {
            try {
                chatRoom.adapter.rooms.get(roomId).delete(removeUserFromRoom.sid)
            } catch (err) {
                console.log(err)
            }
            //Case-1, send message to all user which are already in room
            const leaveMessage = { ...params, name: removeUserFromRoom.name }
            console.log({ leaveMessage })
            socket.to(roomId).emit(EVENTS.BROADCAST_MESSAGE_WHEN_USER_LEAVE, leaveMessage)
            // send me 
            socket.emit(EVENTS.ALL_USER_IN_CURRENT_ROOM, allUsersAfterSomeOneLeftRoom)
            //Case-2, users, which are not in rooms
            chatRoom.emit(EVENTS.BROADCAST_MESSAGE_TO_GLOBAL_USERS, leaveMessage)
            console.log("after")
            console.log(chatRoom.adapter.rooms)
        }
    }
    async onRemoveUserOnCloseTab(sid, socket, chatRoom) {
        try {
            const [removeUserInfo, roomInfo] = await onRemove(sid)
            console.log({ removeUserInfo, roomInfo })
            if (removeUserInfo && roomInfo) {
                const params = {
                    roomName: roomInfo.roomName,
                    roomId: roomInfo.roomId,
                    sid: removeUserInfo[0].sid,
                    userID: removeUserInfo[0].userID,
                    name: removeUserInfo[0].name,
                }
                try {
                    chatRoom.adapter.rooms.get(roomInfo.roomId).delete(sid)
                } catch (err) {
                    console.log(err)
                }
                //Case-1, send message to all user which are already in room
                socket.to(roomInfo.roomId).emit(EVENTS.BROADCAST_MESSAGE_WHEN_USER_LEAVE, params)
                //Case-2, users, which are not in rooms
                chatRoom.except(roomInfo.roomId).emit(EVENTS.BROADCAST_MESSAGE_WHEN_USER_LEAVE, params)
            }
        } catch (err) {
            console.log(err)
        }
    }
    async Messages(msg, chatRoom, socket, callback) {
        if (msg.roomId && msg.roomName) {
            console.log({ message: msg })
            //!check room exist with this roomId and roomName
            const roomIndex = findRoomIndex(msg.roomName, msg.roomId)
            if (roomIndex === -1) {
                callback({ alert: "room does not exits", status: 404, received: false, messageId: msg.msgId })
                return
            }
            await sendMessages(msg, callback, chatRoom)
        }
    }
    async sendPingMessageStart(msg, socket, chatRoom) {
        const RoomIndex = findRoomIndex(msg.roomName, msg.roomId)
        if (RoomIndex !== -1) {
            socket.to(msg.roomId).emit("onTyping", { name: msg.name, isTyping: true })
        }
    }
    async sendPingMessageStop(msg, socket, chatRoom) {
        const RoomIndex = findRoomIndex(msg.roomName, msg.roomId)
        if (RoomIndex !== -1) {
            socket.to(msg.roomId).emit("onTyping", { name: msg.name, isTyping: false })
        }
    }
    async SentAdminInfo(roomInfo, socket, chatRoom) {
        if (roomInfo.roomName && roomInfo.roomId) {
            const RoomIndex = findRoomIndex(roomInfo.roomName, roomInfo.roomId)
            if (RoomIndex !== -1) {
                const findUser = findUserSID(allRooms[RoomIndex].admin.userID, RoomIndex)
                if (findUser) {
                    socket.to(findUser.sid).emit(EVENTS.ADMIN_INFO, { admin: allRooms[RoomIndex].admin.userID })
                }
            }
        }
    }
    async kickOutUser(userInfo, socket, chatRoom) {
        const roomIndex = findRoomIndex(userInfo.roomName, userInfo.roomId)
        if (roomIndex !== -1) {
            // case -1: user kick out by admin or not
            if (allRooms[roomIndex].admin.userID === userInfo.isAdmin) {
                const findUserIndex = findUserIndexInRoom(userInfo.userID, roomIndex)
                if (findUserIndex !== -1) {
                    const removeUser = allRooms[roomIndex].userInRoom.splice(findUserIndex, 1)[0]
                    try {
                        chatRoom.adapter.rooms.get(userInfo.roomId).delete(removeUser.sid)
                    } catch (err) {
                        console.log(err)
                    }
                    //case-1, send to owner
                    socket.to(removeUser.sid).emit("kickout", "you kick out by admin")
                    // case-2: send to all user which exist in room
                    chatRoom.to(userInfo.roomId).except(removeUser.sid).emit("kickoutUser", removeUser)
                    //case-3: send to whole users
                    chatRoom.except(userInfo.roomId).emit("kickoutUserToAll", { ...removeUser, roomName: userInfo.roomName, roomId: userInfo.roomId })
                    console.log("userin room")
                    console.log(chatRoom.adapter.rooms)
                }
            }
            else {
                socket.emit("notAdmin", "you can not kick out.")
            }
        }
    }
}
module.exports = new Socket()