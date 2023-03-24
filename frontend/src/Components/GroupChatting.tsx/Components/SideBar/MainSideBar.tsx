import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { groupUserType } from '../../../../features/types/Alltypes'
import { kickUserType } from '../../GroupChatHome'
import { initialStateType } from '../../types/reducerHandlerType'
import SideBar from './SideBar'



type propType = {
    initialValueReducer: initialStateType
    UserIncurrentRoom: groupUserType[],
    setOpenModal: React.Dispatch<React.SetStateAction<kickUserType>>,
    openModal: kickUserType,
    isAdmin: string,
    userID: string | null
}
function MainSideBar({
    initialValueReducer,
    UserIncurrentRoom,
    setOpenModal,
    openModal,
    isAdmin,
    userID
}: propType) {
    return (
        <AnimatePresence>
            {initialValueReducer.showSideBar && <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: .5, type: "tween", ease: "easeInOut" }}
                exit={{ x: -250 }}
                className="left_sidfe absolute  mobile:w-[71%] w-[40%] md:w-[23%]  h-full border- border-[#7c7777]   overflow-y-auto " id='live_users_in_room'>
                <SideBar currentRoom={UserIncurrentRoom} setOpenModal={setOpenModal} openModal={openModal} userID={userID} isAdmin={isAdmin} />
            </motion.aside>
            }
        </AnimatePresence>

    )
}

export default React.memo(MainSideBar)