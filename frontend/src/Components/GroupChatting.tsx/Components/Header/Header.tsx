import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi"
import React from "react"
import { ACTION_TYPE, groupChatReducerActionType, initialStateType } from "../../types/reducerHandlerType"
type propType = {
    onLeave: () => void,
    roomName: string | null,
    roomId: string | null,
    dispatchState: React.Dispatch<groupChatReducerActionType>,
    initialState: initialStateType
}
function Header({  roomId, onLeave, roomName,dispatchState,initialState }: propType) {
    return (
        // absolute ${showSideBar ? "ml-[13.1%] mobile:ml-[10rem]" : "ml-0"} w-[100%]
        // 001253
        <div className={`header_top z-[5]  bg-[#ae1669] flex`}>
            <div className="wrapper_header flex justify-center items-center w-full">
                <header className="header  py-1 pl-1 drop-shadow-lg ">
                    <button className=' bg-[#dbd7d75c] outline-none px-2 py-1 rounded-md border-[.7px] border-[#ddd9d93a]'
                        onClick={() => {
                            dispatchState({type:ACTION_TYPE.SIDEBAR,payload:{showSideBar:!initialState.showSideBar}})
                            // setShowSideBar(!showSideBar)
                        }}
                    >
                        {initialState.showSideBar ? <HiOutlineChevronLeft className='text-[1.5rem] text-[#f8f8f8]' /> :
                            <HiOutlineChevronRight className='text-[1.5rem] text-[#f8f8f8]' />}
                    </button>
                </header>
                <div className="name_ flex-[7]  py-2 font-serif tracking-wider mobile:hidden text-[#fff]">
                    <p className='flex justify-center truncate select-none
            '>{roomName}</p>
                </div>
                <div className="wrapper_btn flex justify-end pr-8 mobile:justify-end mobile:pr-4 py-1 gap-x-3 flex-[5]">
                    {/* TODO:PODCAST */}
                    {/* <div className="as_listners">
                <button className='btn btn-sm btn-warning'>podcast</button>
            </div> */}
                    <div className="leave_room flex justify-end">
                        {(roomId && roomName) && <button className='btn btn-sm bg-gradient-to-r to-[#ff1500c3] from-[#ff1500d0] hover:bg-[#460101] 
                '
                            onClick={() => {
                                onLeave()
                            }}
                        >leave room</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Header)