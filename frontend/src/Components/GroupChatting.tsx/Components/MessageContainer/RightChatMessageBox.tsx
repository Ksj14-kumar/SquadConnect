import React from 'react'
import { messageType } from "../../../../features/types/Alltypes";
import { format } from "timeago.js"
import GroupFile from './MediaComponents/GroupFile';
import { detectLink } from './util';
type propType = {
    item: messageType,
    messageBoxRef: React.RefObject<HTMLDivElement>,
}
function RightChatMessageBox({ item, messageBoxRef }: propType) {
    return (
        <div className="chat chat-start pb-[1.4rem] w-full" ref={messageBoxRef}>
            {/* ===============================ME======================== */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    {
                        item.pic &&
                        <img src={item.pic} />
                    }
                </div>
            </div>
            <div className="chat-bubble chat-bubble-primary overflow-hidden p-[10px]">
                {/* ==============================Show Files=============================== */}
                {
                    (item.files !== undefined && item.files.length > 0) ? item.files.map((images, index: number) => {
                        const randomKeys = Math.floor(Math.random() * 10000) + Date.now()
                        return (
                            <div key={randomKeys}>
                                <p className='text-[.8rem] font-mono flex justify-end text-[#FBCB0A] select-none pb-1'>~{item.name}</p>
                                <GroupFile filePath={images} />
                                {item.text}
                            </div>
                        )
                    }) :
                        <>
                            <div className="wrapper pl-[8px]">
                                <p className='text-[.8rem] font-mono flex justify-end text-[#FBCB0A] select-none'>~{item.name}</p>
                                <p className='break-all'>
                                    {detectLink(item.text)}
                                </p>
                            </div>
                        </>
                }
                <time className='text-[.8rem] font-thin flex justify-start w-full'>{format(item.time)}</time>
            </div>
            {/* <div className="chat-footer opacity-50 text-white">
                Delivered
            </div> */}
        </div>
    )
}
export default React.memo(RightChatMessageBox)