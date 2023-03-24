import { createSlice } from "@reduxjs/toolkit";
import { responseSuccessType } from "../types/Alltypes";
import { login, register, Success } from "./Thunks";
import { toast } from "react-hot-toast";
type init = {
    token: string,
    name: string,
    email: string,
    isLoading: boolean,
    isError: boolean,
    isSuccess: boolean,
    message: string,
    _id: string,
    picture: string,
    isAuth: boolean
}
const initialState: init = {
    token: "",
    name: "",
    email: "",
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    _id: "",
    picture: "",
    isAuth: Boolean(localStorage.getItem("name")) && Boolean(localStorage.getItem("_id")) && Boolean(localStorage.getItem("email")) && Boolean(localStorage.getItem("picture"))
}
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logout: (state) => {
            state.email = ""
            state.name = ""
            state._id = ""
            state.isAuth = false
            state.picture = ""
            localStorage.clear()
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.message = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                if (action.payload) {
                    state.message = action.payload as string
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                const pay = action.payload as responseSuccessType
                if (pay) {
                    state._id = pay._id
                    state.email = pay.email
                    state.picture = pay.picture
                    state.name = pay.name
                    localStorage.setItem("name", pay.name)
                    localStorage.setItem("_id", pay._id)
                    localStorage.setItem("email", pay.email)
                    localStorage.setItem("picture", pay.picture)
                    state.isAuth = Boolean(pay.email) && Boolean(pay._id) && Boolean(pay.picture) && Boolean(pay.name)
                }
            })
            .addCase(Success.fulfilled, (state, action) => {
                const pay = action.payload as responseSuccessType
                if (pay) {
                    state._id = pay._id
                    state.email = pay.email
                    state.picture = pay.picture
                    state.name = pay.name
                    localStorage.setItem("name", pay.name)
                    localStorage.setItem("_id", pay._id)
                    localStorage.setItem("email", pay.email)
                    localStorage.setItem("picture", pay.picture)
                    state.isAuth = Boolean(pay.email) && Boolean(pay._id) && Boolean(pay.picture) && Boolean(pay.name)
                }
            })
            .addCase(Success.rejected, (state, action) => {
                const status = action.payload
                if (status === 401) {
                    // localStorage.clear()
                    state._id = ""
                    state.email = ""
                    state.picture = ""
                    state.name = ""
                    state.isAuth = false
                }
                if (status === 500) {
                    toast.error("something error occured")
                }
            })
    }
})
// export const { } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions
