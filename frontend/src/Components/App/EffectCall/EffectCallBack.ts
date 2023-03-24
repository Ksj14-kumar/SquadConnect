import { Socket } from "socket.io-client"
import { addNewUserInRoom, addRooms, userLeaveRoom } from "../../../features/Slices/roomSlice"
import { useAppDispatch } from "../../../features/store"
import { groupUserType, roomInterface } from "../../../features/types/Alltypes"
import { EVENTS } from "../../../socket.events"
type dispatchType = ReturnType<typeof useAppDispatch>
export class EffectCall {
    AddNewUser = (socket: Socket, dispatch: dispatchType) => {
        socket.on(EVENTS.NEW_USER_ADDED_ALL, (msg) => {
            dispatch(addNewUserInRoom(msg))
        })
    }
    BroadCastToAllUser = (socket: Socket, dispatch: dispatchType) => {
        socket.on(EVENTS.BROADCAST_MESSAGE_TO_GLOBAL_USER, (msg: groupUserType & { roomName: string, roomId: string }) => {
            dispatch(userLeaveRoom(msg))
        })
    }
    RoomList = (socket: Socket, dispatch: dispatchType) => {
        socket.once(EVENTS.ROOMS, (data: roomInterface) => {
            dispatch(addRooms(data))
        })
    }
    UpdateRoomOnCreate = (socket: Socket, dispatch: dispatchType) => {
        // update_room_on_create
        socket.on(EVENTS.UPDATE_ROOM_ON_CREATE, (data: roomInterface) => {
            dispatch(addRooms(data))
        })
    }
    AllUserAfterKickOut = (socket: Socket, dispatch: dispatchType) => {
        // TODO:think about this in future
        socket.on(EVENTS.AFTER_KICKOUT_USER_TO_GET_ALL_USER, (data: Pick<groupUserType, "userID" | "sid"> & { roomName: string, roomId: string }) => {
            dispatch(userLeaveRoom(data))
        })
    }
}