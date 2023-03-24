import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import thunk from "redux-thunk";
import { loginType, registerType, responseSuccessType, thunkType } from "../types/Alltypes";
const URL = process.env.REACT_APP_BACKEND_DOMAIN
export const register = createAsyncThunk<string, registerType, thunkType>("auth/register",
    async (user, thunkAPI) => {
        try {
            const res = await axios.post(URL+"/api/v1/register", user)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError
            if (error.response?.status === 409 || error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 201 || error.response?.status === 403) {
                return thunkAPI.rejectWithValue(error.response.data)
            }
        }
    })
export const login = createAsyncThunk<string|responseSuccessType, loginType, thunkType>("/auth/login", async (user, thunkAPI) => {
    try {
        const res = await axios.post(URL+"/api/v1/login", user)
        return res.data
    } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 500) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
})
export const Success = createAsyncThunk<responseSuccessType | number, "", thunkType>("/auth/success", async (user, thunkAPI) => {
    try {
        const res = await axios.get(URL+"/api/v1/success", { withCredentials: true })
        return res.data
    } catch (err: unknown) {
        const error = err as AxiosError
        if (error.response?.status === 500 || error.response?.status === 401) {
            return thunkAPI.rejectWithValue(error.request.status)
        }
    }
})