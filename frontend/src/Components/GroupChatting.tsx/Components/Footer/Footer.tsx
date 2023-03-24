import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { MdEmojiEmotions,MdGif ,MdFileUpload} from 'react-icons/md'
type propType = {
    onOpenEmojiModal:boolean,
    inputRef:React.RefObject<HTMLInputElement>,
    userDisconnect:boolean,
    onMessageChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    onKeyPress:(e: React.KeyboardEvent<HTMLInputElement>)=>void,
    inputValue:string,
    setOpenEmojiModal:React.Dispatch<React.SetStateAction<boolean>>,
    onInputFileSelectHandle:(e: React.ChangeEvent<HTMLInputElement>)=>void,
    inputFileRef:React.RefObject<HTMLInputElement>,
    onEmojiSelect:(emojiData: EmojiClickData)=>void
}
function Footer({ 
    onOpenEmojiModal,
    inputRef,
    userDisconnect,
    onMessageChange,
    onKeyPress,
    inputValue,
    setOpenEmojiModal,
    onInputFileSelectHandle,
    inputFileRef,
    onEmojiSelect
}: propType) {
    return (
        <footer className='relative'>
            <AnimatePresence>
                {onOpenEmojiModal &&
                    <motion.div
                        initial={{ y: 350 }}
                        animate={{ y: 0, }}
                        transition={{ duration: 0 }}
                        exit={{ y: 350 }}
                        className="emoji_container">
                        <EmojiPicker
                            emojiStyle={EmojiStyle.FACEBOOK}
                            width="100%"
                            height="340px"
                            lazyLoadEmojis={true}
                            onEmojiClick={onEmojiSelect}
                            previewConfig={{ showPreview: false }}
                            theme={Theme.LIGHT}
                        />
                    </motion.div>
                }
            </AnimatePresence>
            {/* ================================Footer Section=======================================s */}
            <div className="text_input w-full">
                <input
                    ref={inputRef}
                    disabled={userDisconnect}
                    type="text" name="" className='w-full indent-2 outline-none rounded-md rounded-t-none py-3' placeholder='write message...' id=""
                    onChange={onMessageChange}
                    onKeyDown={onKeyPress}
                    value={inputValue}
                />
            </div>
            {/* mobile:top-[10px] top-[5px] */}
            <div className="file_input absolute right-[10px] flex justify-center align-middle bottom-[5px] bg-[#cfcdcd] rounded-full p-1 items-center">
                <label htmlFor="" className=' rounded-full cursor-pointer pl-1'
                    onClick={() => {
                        setOpenEmojiModal(!onOpenEmojiModal)
                    }}
                >
                    <MdEmojiEmotions className="text-[1.8rem] mobile:text-[1.4rem] text-[#024a62]" />
                </label>
                {/* TODO:Add Gif */}
                <label htmlFor="" className=' rounded-full cursor-pointer px-1'>
                    <MdGif className="text-[1.8rem] mobile:text-[1.4rem]  text-[#e40672]" />
                </label>
                <label htmlFor="file" className=' rounded-full cursor-pointer'>
                    <MdFileUpload className="text-[1.8rem] mobile:text-[1.4rem] text-[#e40672]" />
                </label>
                <input
                    accept='image/jpeg,image/png,image/jpg,video/*,audio/*'
                    onChange={onInputFileSelectHandle}
                    ref={inputFileRef}
                    multiple
                    className='hidden' type="file" name="file" id="file" />
            </div>
        </footer>
    )
}
export default React.memo(Footer)