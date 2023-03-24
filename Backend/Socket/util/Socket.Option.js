module.exports.SocketOptions = {
    path: "/messenger",
    transports: ["websocket"],
    // upgrade:false,
    maxHttpBufferSize: 1e+9, // 1GB ,get data size by socket.io as payload
    cors: {
        origin: process.env.UI_URL,
        allowedHeaders: ["Content-Type", "Accept", "Authorization"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
        preflightContinue: true
    },
    cookie: {
        httpOnly: true,
        name: "ck",
        maxAge: 24 * 60 * 60 * 1000
    }
}