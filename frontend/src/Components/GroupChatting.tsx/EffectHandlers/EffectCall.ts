import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { groupUserType, messageType } from "../../../features/types/Alltypes"
import { EVENTS } from "../../../socket.events"
import React from 'react'
import { useAppDispatch } from "../../../features/store"
import { userLeaveRoom } from "../../../features/Slices/roomSlice"
import { nanoid } from "@reduxjs/toolkit"
import { ACTION_TYPE, groupChatReducerActionType, initialStateType } from "../types/reducerHandlerType"
type MessageArrayStatetype = React.Dispatch<React.SetStateAction<messageType[]>>
type UserListInCurrentRoomType = React.Dispatch<React.SetStateAction<groupUserType[]>>
type roomNametype = string | null
type roomIdtype = string | null
type setisAdminType = React.Dispatch<React.SetStateAction<string>>
type setArrivalMessageType = React.Dispatch<React.SetStateAction<messageType>>
type setLeaveMessageType = React.Dispatch<React.SetStateAction<Pick<groupUserType, "name" | "userID" | "sid"> & {
    roomName: string;
    roomId: string;
    text: string;
}>>
type setUserDisconnectType=React.Dispatch<React.SetStateAction<boolean>>
type dispatchStateType = React.Dispatch<groupChatReducerActionType>
export class GroupChatEffectHandlers {
    addNewUser = (socket: Socket, roomName: roomNametype, roomId: roomIdtype, setSendMessageArray: MessageArrayStatetype, setUserListInCurrentRoom: UserListInCurrentRoomType) => {
        //Send to all user which already exist in room
        socket.on(EVENTS.NEW_USER_ADDED, (msg: groupUserType & {
            roomName: string,
            roomId: string,
        }) => {
            if (msg.roomName === roomName && msg.roomId === roomId) {
                const userJoin: messageType = {
                    text: `has join chat.`,
                    name: `${msg.name}`,
                    senderId: "1",
                    pic: msg.userID,
                    roomId: msg.roomId,
                    roomName: msg.roomName,
                    time: "",
                    msgId: `${nanoid(10) ? nanoid(10) : Math.floor(Math.random() * 2000)}`,
                    deliverd: false
                }
                setSendMessageArray(pre => [...pre, userJoin])
                setUserListInCurrentRoom(pre => [msg, ...pre])
            }
        })
    }
    AllUserInCurrentRoom = (socket: Socket, setUserListInCurrentRoom: UserListInCurrentRoomType) => {
        //get all users which already exist in room
        socket.on(EVENTS.ALL_USER_IN_CURRENT_ROOM, (users: groupUserType[]) => {
            setUserListInCurrentRoom([...users])
        })
    }
    GetMessages = (socket: Socket, setArrivalMessage: setArrivalMessageType) => {
        socket.on(EVENTS.GET_MESSAGE, (arrivalMessage: messageType, callback: Function) => {
            setArrivalMessage(arrivalMessage)
            callback({ received: true, messageId: arrivalMessage.msgId, status: 200 })
        })
    }
    adminInfo = (socket: Socket, roomId: roomIdtype, roomName: roomNametype, setisAdmin: setisAdminType) => {
        if (roomId && roomName) {
            socket.emit(EVENTS.ADMIN_INFO, { roomId, roomName })
            socket.on(EVENTS.ADMIN_INFO, (value: { admin: string }) => {
                setisAdmin(value.admin)
            })
        }
    }
    KickOutUser = (socket: Socket, navigate: ReturnType<typeof useNavigate>) => {
        socket.on(EVENTS.KICKOUT, (kick: string) => {
            if (kick) {
                toast.success("kickout by admin", { duration: 5000, position: "top-right" })
                navigate("/")
            }
        })
    }
    leaveRoom = (socket: Socket, setLeaveMessage: setLeaveMessageType, UserIncurrentRoom: groupUserType[], setUserListInCurrentRoom: UserListInCurrentRoomType) => {
        //set all users when someone left chat
        socket.on(EVENTS.USER_LEAVE_ROOM, (msg: Pick<groupUserType, "userID" | "sid" | "name"> & { roomName: string, roomId: string }) => {
            setLeaveMessage({ ...msg, text: "has left chat" })
            const removeUser = UserIncurrentRoom.filter(item => item.sid !== msg.sid && item.userID !== msg.userID)
            if (removeUser) {
                setUserListInCurrentRoom(removeUser)
            }
        })
    }
    Kick_OUT_User = (socket: Socket, roomId: roomIdtype, roomName: roomNametype, setLeaveMessage: setLeaveMessageType, UserIncurrentRoom: groupUserType[], setUserListInCurrentRoom: UserListInCurrentRoomType, dispatch: ReturnType<typeof useAppDispatch>) => {
        socket.on(EVENTS.KICKOUT_USER, (value: groupUserType) => {
            const allUserAfterRemoveUser: groupUserType[] = UserIncurrentRoom.filter(item => item.userID !== value.userID)
            if (allUserAfterRemoveUser && roomId && roomName) {
                setLeaveMessage({ name: value.name, sid: value.sid, userID: value.userID, roomName, roomId, text: "kick out by admin" })
                dispatch(userLeaveRoom({ userID: value.userID, sid: value.sid, roomName, roomId }))
                setUserListInCurrentRoom(allUserAfterRemoveUser)
            }
        })
    }
    onSocketError = (socket:Socket,setUserDisconnect:setUserDisconnectType) => {
        socket.on("error", (err) => {
            setUserDisconnect(true)
            setTimeout(() => {
                socket.connect()
            }, 1000);
        })
    }
    onConnect = (socket:Socket,setUserDisconnect:setUserDisconnectType) => {
        socket.on("connect", () => {
            setUserDisconnect(false)
        })

    }
    onConnectError = (socket:Socket,setUserDisconnect:setUserDisconnectType) => {
        socket.on("connect_error", () => {
            setUserDisconnect(true)
            setTimeout(() => {
                socket.connect()
            }, 1000);

        });
    }
    onSocketDisconnect = (socket:Socket,navigate: ReturnType<typeof useNavigate>) => {
        socket.on("disconnect", (data) => {
            socket.connect()
            navigate("/")
        })
    }
}
