class RoomHandler {
    constructor() {
        this.allRooms = []
    }
    findRoomIndex = (roomName, roomId) => {
        return this.allRooms.findIndex((item) => item.roomName === roomName && item.roomId === roomId)
    }
    findUserSID = (userID, roomIndex) => {
        return this.allRooms[roomIndex].userInRoom.find(item => item.userID === userID)
    }
    findUserIndexInRoom = (userId, roomIndex) => {
        return this.allRooms[roomIndex].userInRoom.findIndex(item => item.userID === userId)
    }
    isUserExistRoom = async (userID, sid, roomID, roomName) => {
        const roomOnIndex = this.findRoomIndex(roomName, roomID)
        if (roomOnIndex !== -1) {
            // return allRooms[roomOnIndex].userInRoom.some(item => item.userID === userID)
            const findUser = this.allRooms[roomOnIndex].userInRoom.findIndex((item) => item.userID === userID)
            if (findUser) {
                //update session id in db
                const updateSID = {
                    ...this.allRooms[roomOnIndex].userInRoom[findUser],
                    sid: sid
                }
                this.allRooms[roomOnIndex].userInRoom[findUser] = updateSID
                return this.allRooms[roomOnIndex].userInRoom.some(item => item.userID === userID)
            }
        }
        else {
            return false
        }
    }
    addUserInRoom = async (userInfo, roomName, roomId) => {
        const indexOfRoom = this.findRoomIndex(roomName, roomId)
        if (indexOfRoom !== -1) {
            this.allRooms[indexOfRoom].userInRoom.unshift(userInfo)
            console.log({userInfo})
            return { ...userInfo, roomName, roomId }
        }
    }
    leaveRoom = async (params) => {
        const { roomId, roomName, userID, sid } = params
        const roomIndex = this.findRoomIndex(roomName, roomId)
        if (roomIndex !== -1) {
            const findUserIndex = this.allRooms[roomIndex].userInRoom.findIndex(item => item.userID === userID)
            if (findUserIndex !== -1) {
                const removeUser = this.allRooms[roomIndex].userInRoom.splice(findUserIndex, 1)[0]
                console.log({ removeUser })
                return removeUser
            }
        }
    }
    onRemove = async (sid) => {
        const findRoomIndex = this.allRooms.findIndex(item => {
            return item.userInRoom.find(item => item.sid === sid)
        })
        if (findRoomIndex !== -1) {
            const findUserIndexInRoom = this.allRooms[findRoomIndex].userInRoom.findIndex((item) => item.sid === sid)
            if (findUserIndexInRoom !== -1) {
                const returnRemoveUser = this.allRooms[findRoomIndex].userInRoom.splice(findUserIndexInRoom, 1)
                return [returnRemoveUser, this.allRooms[findRoomIndex]]
            }
        }
    }
    getUsersFromCurrentRoom = async (roomName, roomId) => {
        console.log({ roomName, roomId })
        const roomIndex = this.findRoomIndex(roomName, roomId)
        console.log({ roomIndex })
        if (roomIndex !== -1) {
            const users = this.allRooms[roomIndex].userInRoom
            console.log({ users })
            return users
        }
    }
}
module.exports = new RoomHandler()