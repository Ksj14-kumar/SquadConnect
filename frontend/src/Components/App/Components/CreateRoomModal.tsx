import { useRef } from 'react'
import { MdClose } from "react-icons/md"
import { useState, useEffect } from "react";
import { Socket } from 'socket.io-client';
import { roomInterface } from '../../../features/types/Alltypes';
import { motion } from "framer-motion"
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom"
import { nanoid } from "@reduxjs/toolkit"
type propType = {
    onOpenCreatRoomModal: React.Dispatch<React.SetStateAction<boolean>>,
    socket: Socket,
    name: string | null,
    userID: string | null,
    pic: string | null,
}
function CreateRoomModal({ onOpenCreatRoomModal, socket, userID, name, pic }: propType) {
    const [roomName, setRoomName] = useState<string>("")
    const [members, setMembers] = useState<string>("unlimited")
    const [onJoin, setOnJoin] = useState<boolean>(false)
    const [arrivalRoom, setArrivalRoom] = useState<roomInterface>({} as roomInterface)
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    useEffect(() => {
        socket.connect()
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef])
    useEffect(() => {
        socket.on("error_on_room_creation", (err) => {
            toast.error(err), { duration: 2000 }
        })
    }, [socket])
    function onchangeRoom(e: React.ChangeEvent<HTMLInputElement>): void {
        setRoomName(e.target.value)
    }
    function onSelectMember(e: React.ChangeEvent<HTMLSelectElement>): void {
        setMembers(e.target.value)
    }
    const onCreate = Boolean(roomName) && Boolean(members)
    function onCreateRoom() {
        if (onCreate) {
            const rId = nanoid()
            socket.emit("create_room", { roomName, name, userID, members, pic, rId })
            setOnJoin(!onJoin)
            onOpenCreatRoomModal(false)
            setRoomName("")
        }
    }
    return (
        <motion.div
            initial={{ y: "0", opacity: 0 }}
            animate={{ y: "1%", opacity: 1 }}
            transition={{ duration: .4, type: "tween" }}
            exit={{ opacity: 0 }}
            className='create_modal  w-full bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  h-full  md:px-[12rem] px-[2rem] py-[4rem]'>
            <div className="wrapper_  bg-gradient-to-r from-[#ad5389] to-[#3c1053] pb-4 rounded-md">
                <header className=' flex justify-end'>
                    <button className="close_btn bg-red-600 py-1 rounded-t-none rounded-r-none rounded-bl-md px-3 rounded-tr-md"
                        onClick={() => {
                            onOpenCreatRoomModal(false)
                        }}
                    >
                        <MdClose className='text-[1.3rem] text-[#ffff]' />
                    </button>
                </header>
                <div className="input_field  mb-2 px-4">
                    <label htmlFor="" className='text-lg font-serif tracking-wider py-1 text-white'>Topic</label>
                    <input type="text" name="" className='w-full py-2 rounded-md focus:outline-none indent-4 outline  outline-double outline-[#181256] mt-2' placeholder='Enter room name...' id=""
                        onChange={onchangeRoom}
                        ref={inputRef}
                    />
                </div>
                <div className="choose client  py-2 px-4">
                    <label htmlFor="" className='text-lg font-serif tracking-wider py-1 text-white mt-2'>Maximum number of participants</label>
                    {/* <input type="number" name="" className='w-full py-2 rounded-md 
                focus:outline-none indent-4' placeholder='number' id="" /> */}
                    <select className='w-full rounded-md focus:outline-none py-2 indent-2 pr-1 outline  outline-double outline-[#181256]' name="" id=""
                        onChange={onSelectMember}
                    >
                        <option value="Unlimited" className='rounded-md'>Unlimited</option>
                        <option value="1" className='rounded-md'>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div className="create_or_not flex px-4">
                    <div className="cancle flex-[6] mr-2">
                        <button className='btn bg-gradient-to-r from-[#c31432] to-[#240b36] w-full tracking-wider'
                            onClick={() => {
                                onOpenCreatRoomModal(false)
                                setMembers("")
                                setRoomName("")
                            }}>Cancle</button>
                    </div>
                    <div className="submit flex-[6]">
                        <button className='btn  w-full tracking-wider bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121]'
                            onClick={onCreateRoom}
                        >Create</button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
export default CreateRoomModal