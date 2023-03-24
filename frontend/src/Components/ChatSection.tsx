import { useNavigate } from "react-router-dom"
import { roomType, userType } from "../features/types/Alltypes"
import React, { useEffect, useState } from "react"
interface messageType {
    room: string,
    message: string,
    id: string
}
function ChatSection({ changeRoom }: { changeRoom: roomType }) {
    const [message, setMessage] = useState<string>("")
    const [sendMessage, setSendMessage] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        if (Object.values(changeRoom).length == 0) {
            navigate("/")
        }
    }, [])
    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setMessage(e.target.value)
    }
    return (
        <div className="chat_section bg-gray-500">
            {
                Object.values(changeRoom).length !== 0 &&
                <>
                    <h1 className="w-screen font-bold text-center py-3">{changeRoom.roomName}</h1>
                    <div className="wrapper flex h-screen ">
                        <div className="live_users flex-[3] flex flex-col py-5">
                            {
                                changeRoom.users.map((item: userType) => {
                                    return (
                                        <p key={item.id} className="text-lg font-serif text-center mb-1 bg-red-600">{item.name}</p>
                                    )
                                })
                            }
                        </div>
                        <div className="chat_area flex-[9] bg-green-400 flex flex-col justify-between">
                            <div className="display_msg w-full px-4 flex pt-2">
                                <div className="msg rounded-md bg-red-500 flex-[6] mr-2 py-4 indent-2">
                                    This is text area
                                </div>
                                <div className="msg rounded-md bg-blue-500 flex-[6] mr-2 py-4 indent-2">
                                    This is text area
                                </div>
                            </div>
                            <div className="input w-full flex">
                                <input type="text" name="" placeholder="msg" id="" className="w-full indent-2"
                                    onChange={onInputChange}
                                />
                                <button className="bg-red-500 text-lg font-serif px-6 ">Send</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
export default ChatSection