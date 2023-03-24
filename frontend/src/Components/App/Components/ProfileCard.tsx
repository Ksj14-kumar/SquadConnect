import { MdClose, MdDelete } from "react-icons/md"
import { profileArray } from "../../../stuff/ProviderArray"
import { profileObject } from "../../../features/types/Alltypes"
import { motion } from "framer-motion"
import { useOnLogoutMutation } from "../../../features/api/apiSlice"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { logout } from "../../../features/Slices/authSlice"
import { useAppDispatch } from "../../../features/store"
import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { EVENTS } from "../../../socket.events"
type propType = {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    name: string | null,
    pic: string | null,
    email: string | null,
}
function ProfileCard({ setOpenModal, pic, name, email }: propType) {
    const [onlogout, { isLoading, isError }] = useOnLogoutMutation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    async function onLogoutHandler() {
        try {
            const res = await onlogout("").unwrap()
            const result: boolean = Boolean(res)
            if (result) {
                dispatch(logout())
                navigate("/login")
            }
        } catch (err: unknown) {
            const error = err as AxiosError
            console.warn(error)
        }
    }
    return (
        <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: [.7, 1] }}
            transition={{ duration: .3 }}
            className=" drop-shadow-lg  relative  md:p-[18rem] md:pt-[6rem] p-[6rem] mobile:pt-[6rem] mobile:p-[1rem] w-screen h-[calc(100vh-0rem)] mobile:w-full">
            <div className="bg-[#041d82] rounded-md text-white">
                <div className="btn_class flex justify-end">
                    <button className="text-lg bg-gradient-to-r from-rose-700 to-pink-600 inset-1 rounded-tr-md px-4 rounded-bl-md"
                        onClick={() => {
                            setOpenModal(false)
                        }}
                    >
                        <MdClose className="text-[1.5rem]" />
                    </button>
                </div>
                <main className="p-4">
                    <div className="userImage avatar rounded-lg bg-gradient-to-r from-red-500 via-blue-700 to-blue-700 flex justify-center py-2">
                        <div className="ring ring-cyan-400 ring-offset-1 inset-2  rounded-full w-[4rem] h-[4rem]">
                            <div className="rounded-full w-ful h-full flex-shrink-0">
                                {pic ?
                                    <img src={pic} className="bg-cover flex-shrink-0" /> :
                                    <div className="image_fo bg-gradient-to-r from-rose-700 to-pink-600 w-full h-full"></div>}
                            </div>
                        </div>
                    </div>
                    <div className="info">
                        <div className="name  flex justify-center py-1">
                            <p className="text-lg font-serif tracking-wider">
                                {name}
                            </p>
                        </div>
                        <div className="email  flex justify-center py-1">
                            <p className="text-lg font-serif tracking-wider">
                                {email}
                            </p>
                        </div>
                    </div>
                    <div className="profile_info_related bg-gradient-to-r from-[#021563] to-[#0d45c9] rounded-md py-2 drop-shadow-sm px-2">
                        {
                            profileArray.map((item: profileObject, index) => {
                                return (
                                    <div key={index} className="profile flex justify-center items-center divide-x py-1 bg-gradient-to-r
                    from-[#072ac3]  to-[#753a88]  rounded-md cursor-pointer mb-1"
                                        onClick={() => {
                                            if (item.id === 4) {
                                                onLogoutHandler()
                                            }
                                        }}
                                    >
                                        <span className="pr-2">{item.icon}</span>
                                        <p className="pl-2 font-serif tracking-wider">{item.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </main>
            </div>
        </motion.div>
    )
}
export default ProfileCard