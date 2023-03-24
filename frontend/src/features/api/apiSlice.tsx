import { createApi, fakeBaseQuery, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginType } from "../types/Alltypes";
const baseQuery = fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_DOMAIN, credentials: "include" })
export const apiSlice = createApi({
    baseQuery,
    endpoints: (builder) => ({
        onLogout: builder.mutation({
            query() {
                return {
                    url: "/api/v1/logout",
                    method: "POST",
                    credentials: "include"
                }
            }
        }),
        // TODO: WORK ON local login
        onLogin: builder.mutation<string, loginType>({
            query(loginInfo) {
                return {
                    url: "/api/v1/login",
                    method: "POST",
                    credentials: "include",
                    data: loginInfo
                }
            }
        })
    })
})
export const { useOnLogoutMutation, useOnLoginMutation } = apiSlice