import React from 'react'
import { MdClose } from "react-icons/md"
import img1 from "../assets/alexandru-zdrobau-BGz8vO3pK8k-unsplash.jpg";
import { motion } from "framer-motion"
import { groupAdminType } from '../../../features/types/Alltypes';
import { format } from "timeago.js"
type propType = {
    setDisplayRoomSetting: React.Dispatch<React.SetStateAction<boolean>>
    admin: groupAdminType,
    height: number
}
const id = localStorage.getItem("_id")
function AboutRoom({ setDisplayRoomSetting, admin, height }: propType) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [1, 2, 3, 4, 5] }}
            transition={{
                duration: .3
            }}
            className={`tool_tips absolute z-[999] h-[87%]   right-4 rounded-md w-[10rem] top-2 overflow-hidden flex flex-col bg-gradient-to-r from-gray-400 via-gray-600 to-blue-800 pb-3`}>
            <p className='flex justify-center text-[1.1rem] font-serif mb-1 text-white '>
                <p className='flex-[11] flex justify-end pr-6 pt-2'>Owner</p>
                <p className='flex-[2]'>
                    <button
                        className='rounded-bl-md rounded-tr-md bg-red-500 p-1'
                        onClick={() => {
                            setDisplayRoomSetting(false)
                        }}
                    ><MdClose className="text-[1.2rem]" /></button>
                </p>
            </p>
            <div className="image_div flex justify-center">
                {admin.pic && <img src={admin.pic} className="bg-cover flex-shrink-0 object-cover rounded-full w-[4rem] h-[4rem] outline-double outline-offset-2 outline-pink-600 border-none" />}
            </div>
            <p className='text-center flex justify-center font-serif text-[1rem] text-white pt-2 tracking-wide select-none px-1  truncate p'>{id === admin.userID ? "you" : admin.name}</p>
            <p className='text-white flex justify-center font-sans select-none'>
                {/* Created At */}
                <span className='font-bold pl-2'>{format(admin.time)}
                </span>
            </p>
            <div className="group flex justify-center pt-2">
                {admin.userID !== id && <button className="btn btn-sm bg-[#130f5b] border-none hover:bg-[#0e05b9]">
                    Follow
                </button>}
            </div>
        </motion.div>
    )
}
export default AboutRoom