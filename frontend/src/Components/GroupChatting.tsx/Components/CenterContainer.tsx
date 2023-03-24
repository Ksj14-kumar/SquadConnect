import React from 'react'
import { messageType } from '../../../features/types/Alltypes'
import { TypingLoader } from '../../../loader/Spinner'
import LeftChatMessageBox from './MessageContainer/LeftChatMessageBox'
import RightChatMessageBox from './MessageContainer/RightChatMessageBox'
type propType = {
    sendMessageArray:messageType[],
    userID:string|null,
    messageBoxRef:React.RefObject<HTMLDivElement>,
    isTypinglisten:{
        name: string;
        isTyping: boolean;
    },
    scrollRef:React.RefObject<HTMLDivElement>
}

function CenterContainer({
    sendMessageArray,
    userID,
    messageBoxRef,
    isTypinglisten,
    scrollRef
}: propType) {
    return (
        <div className="message_box bg-[#480032] flex-1 w-full overflow-y-auto px-2 flex-wrap" id='messageBox' ref={scrollRef}>
            <div className="wrapper flex-1 overflow-y-auto pb-[1.3rem]">
                {
                    sendMessageArray.map((item: messageType, index: number) => {
                        const randomKeys = Math.floor(Math.random() * 10000) + Date.now()
                        return (
                            <div key={randomKeys}>
                                {
                                    item.senderId === "1" ? (
                                        <div className='flex justify-center rounded-[6px]  py-[.2rem] overflow-hidden text-white bg-gradient-to-r from-blue-500 to-slate-300'>
                                            <p>
                                                <b className='font-bold pr-1'>
                                                    {item.name}
                                                </b>
                                                <span className='text-[.9rem]'>{item.text}</span>
                                            </p>
                                        </div>
                                    ) :
                                        (item.senderId === userID ?
                                            (
                                                <LeftChatMessageBox item={item} messageBoxRef={messageBoxRef} />
                                            ) :
                                            (

                                                <RightChatMessageBox item={item} messageBoxRef={messageBoxRef} />
                                            ))
                                }
                            </div>
                        )
                    })
                }
            </div>
            {isTypinglisten.isTyping && <div className='absolute bottom-[3.8rem] text-white w-full'>
                <div className="wrapper flex align-middle items-center">
                    <p className='text-sm tracking-wider font-sans'>{isTypinglisten.name ? isTypinglisten.name.toLowerCase() : "someone"} is</p>
                    <div className=' pl-3'>
                        <TypingLoader h={30} w={30} />
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default React.memo(CenterContainer)