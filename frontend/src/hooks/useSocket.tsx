import React, { useEffect, useRef } from 'react'
import io, { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
function useSocket(uri: string, opts?: Partial<ManagerOptions & SocketOptions> | undefined): Socket {
    const { current: socket } = useRef(io(uri, opts))
    //     // clean connection if already connected
    // useEffect(() => {
    //     return () => {
    //         if (socket) {
    //             socket.close()
    //         }
    //     }
    // }, [])
    return socket
}
export default useSocket