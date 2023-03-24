import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Socket } from 'socket.io-client';
import { groupUserType, messageType } from '../../features/types/Alltypes';
import KickPopModal from './Components/MessageContainer/KickPopModal';
import { toast } from 'react-hot-toast';
import { EmojiClickData } from 'emoji-picker-react';
import { EVENTS } from '../../socket.events';
import { useAppDispatch } from '../../features/store';
import Header from './Components/Header/Header';
import { GroupChatEffectHandlers } from './EffectHandlers/EffectCall';
import { nanoid } from '@reduxjs/toolkit';
import Reconnect from './Components/MessageContainer/Reconnect';
import { ChatGroupComponentReducerHandler, initialState } from './Reducers/GroupChatReducer';
import Footer from './Components/Footer/Footer';
import CenterContainer from './Components/CenterContainer';
import MainSideBar from './Components/SideBar/MainSideBar';
const { addNewUser, AllUserInCurrentRoom, GetMessages, adminInfo, KickOutUser, leaveRoom, Kick_OUT_User,onSocketError,onSocketDisconnect,onConnect,onConnectError } = new GroupChatEffectHandlers()
type setTimeOutType = ReturnType<typeof setTimeout>
export type kickUserType = { isOpen: boolean, userId: string, sid: string }
type propType = {
    socket: Socket
}
// TODO:Stop to get item from localstorage
const pic: string | null = localStorage.getItem("picture")
const name: string | null = localStorage.getItem("name")
const email: string | null = localStorage.getItem("email")
const userID: string | null = localStorage.getItem("_id")
function GroupChatHome({ socket }: propType) {
    const [params] = useSearchParams()
    const [initialValueReducer, dispatchState] = useReducer(ChatGroupComponentReducerHandler, initialState)
    const [UserIncurrentRoom, setUserListInCurrentRoom] = useState<groupUserType[]>([])
    const [inputValue, setInputValue] = useState<string>("")
    const dispatch: ReturnType<typeof useAppDispatch> = useAppDispatch()
    const [isTypinglisten, setIsTypeListen] = useState<{ name: string, isTyping: boolean }>({ name: "", isTyping: false })
    const [typingTimeOut, setTypingTimeOut] = useState<null | setTimeOutType>(null)
    const [leaveMessage, setLeaveMessage] = useState<Pick<groupUserType, "userID" | "sid" | "name"> & { roomName: string, roomId: string, text: string }>({} as Pick<groupUserType, "userID" | "sid" | "name"> & { roomName: string, roomId: string, text: "" })
    const [openModal, setOpenModal] = useState<kickUserType>({ isOpen: false, userId: "", sid: "" })
    const [onOpenEmojiModal, setOpenEmojiModal] = useState<boolean>(false)
    const [sendMessageArray, setSendMessageArray] = useState<messageType[]>([])
    const [arrivalMessage, setArrivalMessage] = useState<messageType>({} as messageType)
    const [onFileSelect, setOnFileSelect] = useState<FileList | null>(null)
    const [userDisconnect, setUserDisconnect] = useState<boolean>(false)
    const [isAdmin, setisAdmin] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const messageBoxRef = useRef<HTMLDivElement>(null)
    const inputFileRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [roomName, roomId]: (string | null)[] = [params.get("name"), params.get("id")]
    useEffect(() => {
        const onGet = [roomName, roomId].every((item) => Boolean(item))
        if (inputRef.current) {
            inputRef.current.focus()
        }
        if (onGet) {
            socket.on(EVENTS.ON_TYPING, (value: { name: string, isTyping: boolean }) => {
                setIsTypeListen({ name: value.name, isTyping: value.isTyping })
            })
        }
        else {
            // TODO: and also remove user when url change or back
            navigate(`/`)
        }
    }, [params, socket])
    useEffect(() => {
        addNewUser(socket, roomName, roomId, setSendMessageArray, setUserListInCurrentRoom)
        AllUserInCurrentRoom(socket, setUserListInCurrentRoom)
        GetMessages(socket, setArrivalMessage)
        adminInfo(socket, roomId, roomName, setisAdmin)
        KickOutUser(socket, navigate)
        onSocketError(socket,setUserDisconnect)
        onConnect(socket,setUserDisconnect)
        onConnectError(socket,setUserDisconnect)
        onSocketDisconnect(socket,navigate)
        
        return () => {
            socket.off(EVENTS.NEW_USER_ADDED)
            socket.off(EVENTS.ALL_USER_IN_CURRENT_ROOM)
            socket.off(EVENTS.GET_MESSAGE)
            socket.off(EVENTS.ADMIN_INFO)
            socket.off(EVENTS.KICKOUT)
        }
    }, [socket])
    useEffect(() => {
        leaveRoom(socket, setLeaveMessage, UserIncurrentRoom, setUserListInCurrentRoom)
        Kick_OUT_User(socket, roomId, roomName, setLeaveMessage, UserIncurrentRoom, setUserListInCurrentRoom, dispatch)
        return () => {
            socket.off(EVENTS.USER_LEAVE_ROOM)
            socket.off(EVENTS.KICKOUT_USER)
        }
    }, [socket, UserIncurrentRoom])
    useEffect(() => {
        if (leaveMessage && leaveMessage.name !== undefined) {
            const userLeave: messageType = {
                text: `${leaveMessage.text}.`,
                name: `${leaveMessage.name}`,
                senderId: "1",
                pic: "",
                roomId: leaveMessage.roomId,
                roomName: leaveMessage.roomName,
                time: leaveMessage.sid,
                msgId: `${nanoid(10) ? nanoid(10) : Math.floor(Math.random() * 2000)}`,
                deliverd: false
            }
            setSendMessageArray(pre => [...pre, userLeave])
        }
    }, [leaveMessage])
    useEffect(() => {
        arrivalMessage.name && setSendMessageArray(pre => [...pre, arrivalMessage])
    }, [arrivalMessage])
    useEffect(() => {
        if (scrollRef.current && messageBoxRef.current) {
            scrollRef.current.scrollTop = messageBoxRef.current.offsetHeight + messageBoxRef.current.offsetTop;
        }
    }, [sendMessageArray])
    //remove user when component unmount globally
    useEffect(() => {
        return () => { socket.emit(EVENTS.ON_LEAVE_ROOM, { roomId, roomName, sid: socket.id, userID }) }
    }, [])
    function onMessageChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (name) {
            socket.emit(EVENTS.ON_TYPING_START, { msg: e.target.value, roomId, roomName, name })
            if (typingTimeOut) clearTimeout(typingTimeOut)
            setTypingTimeOut(setTimeout(() => socket.emit(EVENTS.ON_TYPING_STOP, { msg: e.target.value, roomId, roomName, name }), 500))
        }
        setInputValue(e.target.value)
    }
    function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") {
            if (inputValue) {
                if (onFileSelect && onFileSelect?.length > 0) {
                    const messageStructureWithFile: messageType = {
                        text: inputValue,
                        name: name,
                        senderId: userID,
                        pic,
                        roomId,
                        roomName,
                        time: `${new Date().getTime()}`,
                        file: onFileSelect,
                        msgId: `${nanoid(10) ? nanoid(10) : Math.floor(Math.random() * 2000)}`,
                        deliverd: false
                    }
                    socket.volatile.emit(EVENTS.SEND_MESSAGE, messageStructureWithFile, (response: { alert: string, received: boolean, messageId: string, status: number }) => {
                        if (response.status === 400 || response.status === 404) {
                            toast.error(response.alert, { duration: 2000, position: "top-right" })
                        }
                    })
                }
                else {
                    const messageStructure: messageType = {
                        text: inputValue,
                        name: name,
                        senderId: userID,
                        pic,
                        roomId,
                        roomName,
                        time: `${new Date().getTime()}`,
                        msgId: `${nanoid(10) ? nanoid(10) : Math.floor(Math.random() * 2000)}`,
                        deliverd: false
                    }
                    socket.volatile.emit(EVENTS.SEND_MESSAGE, messageStructure, (response: { alert: string, received: boolean, messageId: string, status: number }) => {
                        if (response.status === 400 || response.status === 404) {
                            toast.error(response.alert, { duration: 2000, position: "top-right" })
                        }
                    })
                }
                if (inputFileRef.current) {
                    inputFileRef.current.value = ""
                }
                setInputValue("")
                setOnFileSelect(null)
                if (inputRef.current) {
                    inputRef.current?.focus()
                }
            }
        }
    }
    // TODO:Leave room functionality
    function onLeave(): void {
        socket.emit(EVENTS.ON_LEAVE_ROOM, { roomId, roomName, sid: socket.id, userID })
        navigate("/")
    }
    function onInputFileSelectHandle(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const size = e.target.files[0].size
            if (size > 1000000000) {
                toast.error("file size is too large", { duration: 2000 })
            }
            setInputValue(e.target.files[0].name)
            setOnFileSelect(e.target.files)
        }
    }
    function onEmojiSelect(emojiData: EmojiClickData) {
        setInputValue(pre => pre + emojiData.emoji)
    }
    return (
        <div className='bg-[#071134d9] flex flex-col h-screen  overflow-hidden relative'>
            {
                userDisconnect &&
                <Reconnect />
            }
            {(openModal.isOpen && isAdmin) && <KickPopModal
                setOpenModal={setOpenModal}
                openModal={openModal}
                roomName={roomName}
                roomId={roomId}
                socket={socket}
                isAdmin={isAdmin}
            />}
            <MainSideBar
                initialValueReducer={initialValueReducer}
                UserIncurrentRoom={UserIncurrentRoom}
                setOpenModal={setOpenModal}
                openModal={openModal}
                isAdmin={isAdmin}
                userID={userID}
            />
            {/* ================================ Right_side bar content   ==================================*/}
            <div className={`right_side bg-red-700 w-full ${initialValueReducer.showSideBar ? "md:ml-[23%] ml-[40%] mobile:ml-[70%]" : "ml-0"}`}>
                <Header dispatchState={dispatchState} initialState={initialValueReducer} roomId={roomId} onLeave={onLeave} roomName={roomName} />
            </div>
            <main className={`content2 mobile:pb-[.5rem] px-4 mobile:px-0 min-h-[calc(100vh-2.7rem)] flex flex-col ${initialValueReducer.showSideBar ? "md:ml-[23%] ml-[40%] mobile:ml-[71%]" : "ml-0"}`}>
                <CenterContainer
                    sendMessageArray={sendMessageArray}
                    userID={userID}
                    messageBoxRef={messageBoxRef}
                    isTypinglisten={isTypinglisten}
                    scrollRef={scrollRef}
                />
                <Footer
                    onOpenEmojiModal={onOpenEmojiModal}
                    inputRef={inputRef}
                    userDisconnect={userDisconnect}
                    onMessageChange={onMessageChange}
                    onKeyPress={onKeyPress}
                    inputValue={inputValue}
                    setOpenEmojiModal={setOpenEmojiModal}
                    onInputFileSelectHandle={onInputFileSelectHandle}
                    inputFileRef={inputFileRef}
                    onEmojiSelect={onEmojiSelect}
                />
            </main>
        </div>
    )
}
export default React.memo(GroupChatHome);