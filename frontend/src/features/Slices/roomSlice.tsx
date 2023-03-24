import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { groupUserType, roomInterface } from "../types/Alltypes"
interface roomType {
    rooms: roomInterface[]
}
const initialState: roomType = {
    rooms: []
}
const roomSlice = createSlice({
    name: "roomSlice",
    initialState,
    reducers: {
        addRooms: (state, action: PayloadAction<roomInterface>) => {
            if (action.payload instanceof Array) {
                const isArrivalRoom = [...action.payload, ...state.rooms]
                state.rooms = isArrivalRoom
            }
            else {
                const isArrivalRoom = [action.payload, ...state.rooms]
                state.rooms = isArrivalRoom
            }
        },
        addNewUserInRoom: (state, action: PayloadAction<groupUserType & { roomName: string } & { roomId: string }>) => {
            const { roomId, roomName, ...info } = action.payload
            const findRoomIndex = state.rooms.findIndex(item => item.roomName === roomName && item.roomId === roomId)
            if (findRoomIndex !== -1) {
                state.rooms[findRoomIndex].userInRoom.splice(0, 0, info)
            }
        },
        userLeaveRoom: (state, action: PayloadAction<Pick<groupUserType, "userID" | "sid"> & { roomName: string } & { roomId: string }>) => {
            if (action.payload.roomId && action.payload.roomName && action.payload.sid && action.payload.userID) {
                const { roomId, roomName, userID, sid } = action.payload
                const findRoomIndex = state.rooms.findIndex((item) => item.roomId === roomId && item.roomName === roomName)
                if (findRoomIndex !== -1) {
                    const findUserIndexInRoom = state.rooms[findRoomIndex].userInRoom.findIndex((item) =>item.userID === userID)
                    if (findUserIndexInRoom !== -1) {
                        const result = state.rooms[findRoomIndex].userInRoom.splice(findUserIndexInRoom, 1)
                    }
                }
            }
        }
    }
})
export const { addRooms, addNewUserInRoom, userLeaveRoom } = roomSlice.actions
export const roomReducer = roomSlice.reducer