export const socketOptions = {
    path: "/messenger",
    transports: ["websocket"],
    auth: {
        token: localStorage.getItem("tt")
    },
    query: {
        num: 1
    },
    withCredentials: true,
    reconnection: false,
}