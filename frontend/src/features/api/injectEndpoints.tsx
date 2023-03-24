import { apiSlice } from "./apiSlice";
const injectEndPoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccess: builder.query({
            query() {
                return {
                    url: "/api/v1/success",
                    credentials: "include"
                }
            }
        }),
    })
})
export const { useGetAccessQuery } = injectEndPoints;