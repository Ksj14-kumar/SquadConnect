import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'
import { ImFacebook2 } from 'react-icons/im'
import { MdClose, MdDelete } from "react-icons/md"
import { HiUser } from "react-icons/hi"
import { TbSettings } from "react-icons/tb"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { profileArrayType } from '../features/types/Alltypes'
export const LoginProviders = [
    {
        name: "Google",
        icon: <FcGoogle className="text-[2.1rem] mobile:text-[1.4rem]" />,
        id: 1
    },
    {
        name: "Facebook",
        icon: <ImFacebook2 className="text-[2.1rem] mobile:text-[1.4rem] text-[#0d1be1fb] bg-white rounded-md" />,
        id: 2
    },
    {
        name: "Github",
        icon: <BsGithub className="text-[2.1rem] mobile:text-[1.4rem] bg-white rounded-md p-[.1rem] text-[#080808]" />,
        id: 3
    },
]
export const profileArray: profileArrayType = [
    // TODO: Adding in Future
    // { id:1,name: "Profile", icon: <HiUser className="text-[1.3rem]" /> },
    // { id:2,name: "Setting", icon: <TbSettings className="text-[1.3rem]" /> },
    // { id:3,name: "Delete", icon: <MdDelete className="text-[1.3rem]" /> },
    { id:4,name: "Logout", icon: <RiLogoutCircleRLine className="text-[1.3rem]" /> }
]