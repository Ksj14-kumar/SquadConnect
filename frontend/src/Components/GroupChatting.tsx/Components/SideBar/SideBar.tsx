import { groupUserType } from '../../../../features/types/Alltypes';
import React, { useState } from "react";
import getRandomColor from '../../../../stuff/RandomColor';
import { kickUserType } from '../../GroupChatHome';
type propType = {
    currentRoom: groupUserType[],
    setOpenModal: React.Dispatch<React.SetStateAction<kickUserType>>,
    openModal: kickUserType,
    userID: string | null,
    isAdmin: string
}
function SideBar({ currentRoom, setOpenModal, openModal, userID, isAdmin }: propType) {
    return (
        <div>
            <header className='bg-[#0938e3]    z-[5] py-2 flex items-center'>
                <p className='truncate text-[#fff] select-none pr-6 font-serif text-[1.2rem] indent-2 tracking-wider'>
                    users in room
                </p>
            </header>
            <div className="inner_left relative z-[3] " >
                <div className="all_users_in_room  flex flex-col py-1 w-full overflow-hidden px-1 gap-y-1">
                    {
                        currentRoom?.map((item: groupUserType, index: number) => {
                            const colors = getRandomColor()
                            const randomKeys = Math.floor(Math.random() * 10000) + Date.now()
                            return (
                                    <div  key={randomKeys} className="image_wrapper flex items-center bg-[#03a9d7c6] w-full py-1 rounded-md drop-shadow-lg cursor-pointer"
                                        onClick={() => {
                                            if (isAdmin) {
                                                if (userID !== item.userID) {
                                                    setOpenModal({ isOpen: !openModal.isOpen, sid: item.sid, userId: item.userID })
                                                }
                                                else if (userID === isAdmin && userID !== item.userID) {
                                                    setOpenModal({ isOpen: !openModal.isOpen, sid: item.sid, userId: item.userID })
                                                }
                                            }
                                        }}
                                    >
                                        <div className={`image_containee rounded-full w-[3rem] h-[3rem] flex-shrink-0 ring-[1px] ring-offset-[.1rem] ${colors}  p-[2px] ml-2`}>
                                            <img src={item.pic} alt="" className='rounded-full w-full h-full flex-shrink-0' />
                                        </div>
                                        <div className="name pl-2 w-full  py-2">
                                            <p className='truncate text-[1.1rem] pr-[3.7rem] font-serif tracking-wider select-none text-[#fff]'>{item.name}</p>
                                        </div>
                                    </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default React.memo(SideBar)