import React, { useState, useEffect } from "react"
import ProfileCard from "../Components/App/Components/ProfileCard";
import { AiOutlinePlus } from "react-icons/ai";
import RoomCard from "../Components/App/Components/RoomCard";
import CreateRoomModal from "../Components/App/Components/CreateRoomModal";
import { Socket } from "socket.io-client"
import { roomInterface } from "../features/types/Alltypes";
import { AnimatePresence, motion } from "framer-motion"
type propType = {
    allRooms: roomInterface[],
    socket: Socket,
    onJoin: (roomID: string, roomName: string) => void,
    name: string | null,
    pic: string | null,
    email: string | null,
    userID: string | null
}
function Home({ allRooms, socket, onJoin, name, pic, email, userID }: propType) {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [createRoomModal, onOpenCreatRoomModal] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [rooms, setRooms] = useState<roomInterface[]>(allRooms)
    useEffect(() => {
        if (query.length > 0) {
            const filterRooms: roomInterface[] = rooms.filter(item => item.roomName.toLowerCase().includes(query.toLowerCase()))
            if (filterRooms) {
                setRooms(filterRooms)
            }
        }
        else {
            setRooms(allRooms)
        }
    }, [query, allRooms])
    function onRoomSearch(e: React.ChangeEvent<HTMLInputElement>): void {
        setQuery(e.target.value)
    }
    return (
        <>
            <div className='bg-[#021664] w-full py-[0rem]'>
                {/* ====================================Admin Navigation===================================== */}
                <header className='top_header fixed z-[10] w-full flex justify-between items-center drop-shadow-lg bg-[#01166c] px-1 py-[6px]'>
                    <div className="left_side  flex-[4]">
                        <p className="text-white font-serif truncate tracking-widest">SquadConnect</p>
                    </div>
                    <div className="right_side flex-[8] flex j pr-2  justify-end  items-center">
                        <div className="name flex justify-end align-middle h-full  pr-4">
                            {name ? <p className="text-[1rem] mobile:text-[.86rem] tracking-wider text-[#fff]">{name}</p> : ""}
                        </div>
                        <div className="avatar online  outline-fuchsia-500  outline-offset-1 outline rounded-full flex justify-center items-center align-middle  cursor-pointer"
                            onClick={() => {
                                setOpenModal(!openModal)
                            }}
                        >
                            <div className="w-[2.7rem] rounded-full">
                                {
                                    pic ?
                                        <img src={pic} className="flex-shrink-0" /> :
                                        // <img src={img2} className="flex-shrink-0" />
                                        <div className="image_fo bg-gradient-to-r from-rose-700 to-pink-600 w-full h-full"></div>
                                }
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            {/* //===============================PROFILE CARD COMPONENT=============================== */}
            <div className="modal_container mobile:w-full w-screen -5 bg-[#14163ecf] absolute z-[2]">
                <AnimatePresence>
                    {openModal &&
                        <motion.div
                            exit={{ opacity: 0 }}
                            className="wrapper"
                        >
                            <ProfileCard setOpenModal={setOpenModal} name={name} pic={pic} email={email} />
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            {/* ================================ROOM MODAL=================================================== */}
            <AnimatePresence>
                {
                    createRoomModal &&
                    <motion.div
                        transition={{ duration: .5 }}
                        exit={{ opacity: 0 }}
                        className="create_room_modal  mobile:w-full w-full  absolute z-[2] h-full">
                        <CreateRoomModal onOpenCreatRoomModal={onOpenCreatRoomModal} socket={socket} name={name} userID={userID} pic={pic} />
                    </motion.div>
                }
            </AnimatePresence>
            <main className="body_section mt-[3.3rem]  w-full md:px-[4rem] overflow-y-auto h-[calc(100vh-3.3rem)]" id="roomContainer">
                {/* bg-gradient-to-r from-[#001253] to-[#050644] */}
                <div className="main_section_wrapper_input  px-2 pb-2">
                    <div className="input_field_btn pt-3">
                        <button className="btn btn-block btn-sm  bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] tracking-wider flex justify-center align-middle items-center cursor-pointer"
                            onClick={() => {
                                onOpenCreatRoomModal(!createRoomModal)
                            }}
                        >
                            <AiOutlinePlus className="text-[1.5rem] font-serif" /> <span className="text-[.8rem] pl-1">Create a room</span></button>
                    </div>
                    <div className="input_field mt-1">
                        <input type="search" name="" className="w-full rounded-md py-1 indent-2 tracking-wider focus:outline-none border border-solid border-[#0538af] drop-shadow-sm" placeholder="Search.."
                            onChange={onRoomSearch}
                            value={query}
                            id="" />
                    </div>
                    {/* ==================== ====================ROOM LIST CARD================================================= */}
                    <div className={`live_room drop-shadow-lg flex flex-wrap  ${allRooms && allRooms.length > 2 ? "justify-center gap-x-1 " : "justify-start"} mt-2`}>
                        {
                            rooms.length > 0 && rooms.map((item: roomInterface) => {
                                const randomKeys = Math.floor(Math.random() * 10000) + Date.now()
                                return (
                                    <div className="wrapper_key mobile:w-full" key={randomKeys}>
                                        {item.roomId &&
                                            <RoomCard item={item} onJoin={onJoin} />
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </main>
        </>
    )
}
export default React.memo(Home)