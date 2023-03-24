import { useEffect, useState } from 'react'
import { TbSettings } from "react-icons/tb"
import { groupUserType, roomInterface } from '../../../features/types/Alltypes';
import AboutRoom from './AboutRoom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import getRandomColors from "../../../stuff/RandomColor"
type propType = {
    item: roomInterface,
    onJoin: (roomID: string, roomName: string) => void,
}
function RoomCard({ item, onJoin }: propType) {
    const [displayRoomSetting, setDisplayRoomSetting] = useState<boolean>(false)
    const [allRoomUser, setAllRoomUser] = useState<groupUserType[]>([])
    const [leftArrayUser, setLeftUSerArray] = useState<groupUserType[]>([])
    const [rightUsersArray, setRightUserArray] = useState<groupUserType[]>([])
    const navigate = useNavigate()
    // TODO:storage handle
    const fromStorage: string | null = localStorage.getItem("_id")
    const onDisabled = item.members !== "unlimited" && (+item.members === item.userInRoom.length && item.admin.userID !== fromStorage)
    useEffect(() => {
        const totalUser = item.userInRoom.length
        const remainsUser = totalUser > 19 ? totalUser - 19 : totalUser
        if (remainsUser !== totalUser) {
            const leftUserArray = item.userInRoom.slice(0, 19)
            const rightUserArray = item.userInRoom.slice(19, totalUser)
            setLeftUSerArray(leftUserArray)
            setAllRoomUser(leftUserArray)
            setRightUserArray(rightUserArray)
        }
        else {
            setAllRoomUser(item.userInRoom)
        }
        return () => {
            setRightUserArray([])
        }
    }, [item])
    const isAlready = item.userInRoom.some(item => item.userID === fromStorage)
    return (
        <div className="room_card border border-solid border-[#1e00002e] flex  rounded-md mt-1 py-2 px-3 flex-col  w-[25rem] mobile:w-full mobile:bg-red-600 drop-shadow-lg  relative overflow-hidden  bg-gradient-to-l from-[#040771] via-[#040771] to-[#0c11a6] ">
            {/* =================================PROFILE_CARD_HEADER======================================== */}
            <header className="header  py-3 flex items-center rounded-md rounded-b-none">
                {/* <div className="logo flex-[2] ">
                    <p className='indent-4 tracking-wider font-serif'>LOGO</p>
                </div> */}
                <div className="name flex-[8]">
                    <p className='text-[1.3rem] mobile:text-[1.1rem] md:indent-1 text-white'>{item.roomName}</p>
                </div>
                <div className="gear flex-[2]  flex justify-end pr-3  items-center">
                    <p className="text-lg  cursor-pointer"
                        onClick={() => {
                            setDisplayRoomSetting(!displayRoomSetting)
                        }}
                    ><TbSettings className='text-[1.4rem] mobile:text-[1.2rem] text-[#fff]' /></p>
                </div>
            </header>
            {/* =====================================ROOM TOOLTIPS  COMPONENTS================================= */}
            <AnimatePresence>
                {
                    displayRoomSetting &&
                    <motion.div className="wrapper"
                        transition={{ duration: .3 }}
                        exit={{ opacity: 0 }}>
                        <AboutRoom height={item.userInRoom.length} setDisplayRoomSetting={setDisplayRoomSetting} admin={item.admin} />
                    </motion.div>
                }
            </AnimatePresence>
            {/* ===================================ROOM GROUP LIST======================================= */}
            <div className="groups">
                {
                    isAlready &&
                    <p className='text-white py-1 rounded-sm tracking-wider font-light text-sm flex justify-center bg-[#0552e2]'>you already in this group.</p>
                }
                <div className="image_section   flex py-5 px-4  flex-wrap  gap-y-3 rounded-none">
                    {allRoomUser && allRoomUser.map((item: groupUserType, index: number) => {
                        const colors = getRandomColors()
                        return (
                            <div key={item.userID} className="">
                                <div className="group_users">
                                    <img src={item.pic} className={`${index} rounded-full w-[2.8rem] h-[2.8rem]  flex-shrink-0 ring-[2px]  ring-offset-[.1rem] ${colors}  flex justify-center align-middle bg-cover drop-shadow-lg`} />
                                </div>
                            </div>
                        )
                    })}
                    {rightUsersArray.length > 0 && <div className="image_sec bg-cover bg-inherit">
                        <div className="group_users  rounded-full">
                            <div className="users rounded-full  bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] w-[2.8rem] h-[2.8rem] flex justify-center items-center outline outline-offset-1 outline-[#fff] ">
                                <p className='text-lg text-white'>
                                    +{
                                        rightUsersArray.length
                                    }</p>
                            </div>
                        </div>
                    </div>}
                </div>
                {/* ===============================PROFILE FOOTER BUTTON=============================== */}
                <footer className=' rounded-md rounded-t-none w-full  flex justify-center py-2'>
                    <button className='text-sm btn-sm bg-gradient-to-r from-[#13005A] via-[#13005A] to-red-600 btn outline-dashed outline-[1px] outline-offset-2 w-[10rem] text-white animate-pulse select-none'
                        disabled={onDisabled}
                        onClick={() => {
                            onJoin(item.roomId, item.roomName)
                        }}
                    >
                        {
                            (item.members !== "unlimited" && +item.members === item.userInRoom.length) ?
                                <span className='text-white'>
                                    Room is full
                                </span> : "Join room"
                        }
                    </button>
                </footer>
            </div>
        </div >
    )
}
export default RoomCard