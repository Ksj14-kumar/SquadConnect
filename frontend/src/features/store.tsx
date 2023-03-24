import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { authReducer } from "./Slices/authSlice";
import { apiSlice } from "./api/apiSlice"
import {roomReducer} from "./Slices/roomSlice"
import { roomInterface } from "./types/Alltypes";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        roomSlice:roomReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (gdm) => gdm().concat(apiSlice.middleware),
    devTools: true,
})
type rootReducer = ReturnType<typeof store.getState>
type dispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<dispatchType>()
export const useAppSelector: TypedUseSelectorHook<rootReducer> = useSelector
export const Selector = (state: rootReducer) => {
    return state.auth
}
export const roomSelector= (state:rootReducer)=>{
    return state.roomSlice.rooms
}