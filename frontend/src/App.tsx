import LoginHome from "./Components/App/Components/LoginHome";
import { useEffect, useRef } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Protected from "./auth/Protected";
import { Success } from "./features/Slices/Thunks";
import { roomSelector, Selector, useAppDispatch, useAppSelector } from "./features/store";
import Home from "./Pages/Home";
import PageNotFound from "./Pages/PageNotFound";
import { io, Socket } from "socket.io-client";
import { socketOptions } from "./stuff/Socket_Options";
import Speaker from "./Components/Speakers/SpeakerRoom";
import GroupChatHome from "./Components/GroupChatting.tsx/GroupChatHome";
import { useOnLogoutMutation } from "./features/api/apiSlice";
import { logout } from "./features/Slices/authSlice";
import { EVENTS } from "./socket.events";
import { EffectCall } from "./Components/App/EffectCall/EffectCallBack"
import { toast } from "react-hot-toast";
const { AddNewUser, BroadCastToAllUser, RoomList, UpdateRoomOnCreate, AllUserAfterKickOut } = new EffectCall()
function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(Selector)
  const roomState = useAppSelector(roomSelector)
  const [onLogout, { isLoading }] = useOnLogoutMutation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // const URL = process.env.REACT_APP_BACKEND_DOMAIN
  const socket = useRef<Socket>(io("/api/v1/chat", socketOptions))
  const pic: string | null = localStorage.getItem("picture")
  const name: string | null = localStorage.getItem("name")
  const email: string | null = localStorage.getItem("email")
  const userID: string | null = localStorage.getItem("_id")
  useEffect(() => {
    (async function () {
      try {
        const res = await dispatch(Success("")).unwrap()
        if (res) {
          if (pathname === "/login") {
            navigate("/")
          }
          else {
            navigate(pathname)
          }
        }
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])
  useEffect(() => {
    RoomList(socket.current, dispatch)
    return () => {
      socket.current.off(EVENTS.ROOMS)
    }
  }, [socket.current, dispatch])
  useEffect(() => {
    AddNewUser(socket.current, dispatch)
    BroadCastToAllUser(socket.current, dispatch)
    //logout user
    socket.current.on(EVENTS.LOGOUT, async (status) => {
      if (status == 401) {
        try {
          const res: { message: string } = await onLogout("").unwrap()
          const result: boolean = Boolean(res)
          if (result) {
            dispatch(logout())
            navigate("/login")
          }
        } catch (err) {
          // console.log({ err })
        }
      }
    })
    return () => {
      socket.current.off(EVENTS.NEW_ROOM_UPDATE)
      socket.current.off(EVENTS.NEW_USER_ADDED_ALL)
      socket.current.off(EVENTS.USER_LEAVE_ROOM)
      socket.current.off(EVENTS.LOGOUT)
    }
  }, [socket.current, dispatch])
  useEffect(() => {
    UpdateRoomOnCreate(socket.current, dispatch)
    AllUserAfterKickOut(socket.current, dispatch)
    return () => {
      socket.current.off(EVENTS.UPDATE_ROOM_ON_CREATE)
      socket.current.off(EVENTS.AFTER_KICKOUT_USER_TO_GET_ALL_USER)
    }
  }, [socket.current, dispatch])
  const onJoin = (roomID: string, roomName: string) => {
    socket.current.disconnected && socket.current.connect()
    socket.current.emit(EVENTS.ON_JOIN, { roomID, roomName, name, pic, userID, sid: socket.current.id }, (response: { alert: string, status: number }) => {
      if(response.status===400){
        toast.error(response.alert,{duration:3000,position:"top-right"})
      }
      else if(response.status===200){
        navigate(`/room?name=${roomName}&id=${roomID}`)
      }
    })
  }
  return (
    <div className="App  absolute bg-[#010c34] bg-cover w-full h-full overflow-hidden">
      <Routes>
        {
          !authState.isAuth &&
          <>
            <Route path="/register" element={<LoginHome />} />
            <Route path="/login" element={<LoginHome />} />
          </>
        }
        <Route element={<Protected isAuth={authState.isAuth} />}>
          <Route path="/" element={<Home allRooms={roomState} socket={socket.current} onJoin={onJoin} name={name} userID={userID} pic={pic} email={email} />} />
          <Route path="/room" element={<GroupChatHome socket={socket.current} />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}
export default App;
