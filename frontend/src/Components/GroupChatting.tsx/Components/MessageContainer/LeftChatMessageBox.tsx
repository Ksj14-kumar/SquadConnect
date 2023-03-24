import React, { useEffect } from "react"
import { messageType } from "../../../../features/types/Alltypes";
import { format } from "timeago.js"
import GroupFile from "./MediaComponents/GroupFile";
import { MdError } from "react-icons/md"
import { BiTimeFive } from "react-icons/bi"
import { detectLink } from "./util";
type propType = {
    item: messageType,
    messageBoxRef: React.RefObject<HTMLDivElement>,
}
function LeftChatMessageBox({ item, messageBoxRef }: propType) {
    return (
        <div className="chat chat-end  w-full pb-[1.6rem]" ref={messageBoxRef}>
            {/* ========================Another User============================== */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    {
                        item.pic &&
                        <img src={item.pic} />
                    }
                </div>
            </div>
            <div className="text-white overflow-hidden flex items-center">
                {/* TODO:future add warning message */}
                {/* <div className="text-white">
                    <MdError className="text-md rounded-full bg-[#ffffff] text-[#ea0707] font-sans text-[1.2rem] md:text-[1.4rem]" />
                </div> */}
                <div className="wrapper_message ml-1 chat-bubble-secondary rounded-xl rounded-br-none px-2 py-[3px] pb-[5px]">
                    {/* ==============================Show Files=============================== */}
                    {
                        (item.files !== undefined && item.files.length > 0) ? item.files.map((images, index: number) => {
                            const randomKeys = Math.floor(Math.random() * 10000) + Date.now()
                            return (
                                <div key={randomKeys} className="break-all flex flex-col">
                                    <p key={index} className='text-[.8rem] font-mono flex justify-end pb-1 text-[#FBCB0A] select-none'>
                                        {/* ~{item.name} */}
                                       ~you
                                    </p>
                                    <GroupFile filePath={images} />
                                    {item.text}
                                </div>
                            )
                        }) :
                            <>
                                <div className="wrapper pl-[8px]">
                                    <p className='text-[.8rem] font-mono flex justify-end text-[#FBCB0A] select-none'>
                                        {/* ~{item.name} */}
                                        ~you
                                    </p>
                                    <p className="break-all">
                                        {detectLink(item.text)}
                                    </p>
                                </div>
                            </>
                    }
                    <p className="flex items-center">
                        <time className='text-[.8rem] font-thin flex justify-start w-full pl-2'>{format(item.time)}</time>
                    </p>
                </div>
            </div>
            {/* TODO:add in future for deliver */}
            {/* <div className="chat-footer opacity-50 text-white">
                Delivered
            </div> */}
        </div>
    )
}
export default React.memo(LeftChatMessageBox); 