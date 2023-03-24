const path = require("path")
const fs = require("fs")
const RoomDb = require("../../db/room")
const { detectFile } = require("../../Config/DetectFile")
const { fileAllow } = require("../util/BreakUnknowFile")
const EVENTS = require("../socket.events")
class Messages {
    WriteFile = async (msg, callback) => {
        const updatePath = path.join(__dirname, "../Messagefile")
        const filePathFromStaticDir = `${msg.roomId}/${msg.roomName}`
        const createPath = path.join(updatePath, filePathFromStaticDir)
        if (!fs.existsSync(createPath)) {
            fs.mkdirSync(createPath, { recursive: true })
        }
        let allFilePathArray = []
        // TODO:Write all files
        for (var k in msg.file) {
            const buffer = Buffer.from(msg.file[k])
            const { ext, mime } = detectFile(buffer)
            const isValidFile = fileAllow(ext)
            if (!isValidFile) {
                // !Callback when invalid file formate
                callback({ alert: "Invalid file", status: 400, received: false, messageId: msg.msgId })
                return
            }
            else {
                const randomName = Math.floor(Math.random() * 1000000)
                const fileFullPath = filePathFromStaticDir + `/${msg.senderId}-${randomName}.` + ext
                const newPath = path.join(updatePath, fileFullPath)
                console.log({ fileFullPath })
                allFilePathArray.push({ type: ext, url: fileFullPath })
                fs.appendFileSync(newPath, buffer)
            }
        }
        return allFilePathArray
    }
    sendMessages = async (msg, callback, chatRoom) => {
        try {
            let filesPath;
            if (msg.file) {
                filesPath = await this.WriteFile(msg, callback)
                if (!filesPath) {
                    return
                }
            }
            delete msg["file"]
            const updateMessageWithTime = {
                ...msg,
                files: filesPath,
                time: new Date().getTime()
            }
            await RoomDb.findOneAndUpdate(
                { $and: [{ roomName: msg.roomName }, { roomId: msg.roomId }] },
                { $push: { "messages": updateMessageWithTime } }
            )
            chatRoom.to(msg.roomId).timeout(30000).emit(EVENTS.GET_MESSAGE, updateMessageWithTime, (err, msgId) => {
                try {
                    if (msgId) {
                        const { status, received, messageId } = msgId[0]
                        if (status === 200) {
                            console.log({ msgId })
                            callback({ alert: "message has been sent", status, received, messageId })
                        }
                    }
                } catch (err) {
                    console.warn(err)
                }
            })
        } catch (err) {
            console.log(err)
            console.log("file not write", err)
            callback({ alert: "something error happend", status: 400, received: false, messageId: msg.msgId })
        }
    }
}
module.exports = new Messages()