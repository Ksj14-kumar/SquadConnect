import {useNavigate, useLocation} from "react-router-dom"
function SingUpRouter() {
    const navigate= useNavigate()
    const {pathname}= useLocation()
    return (
        <div className={`signUp w-full flex justify-center align-middle rounded-md rounded-tl-none rounded-bl-none  cursor-pointer py-1 px-2 ${pathname==="/register" ?"bg-gradient-to-r to-red-700 via-red-800 from-gray-900":"bg-gradient-to-l from-blue-700 via-blue-800 to-gray-900"}`}
        onClick={()=>{
            navigate("/register")
        }}
        >
            <h1 className="text-center tracking-wider font-serif text-[1.1rem]  w-full  rounded-md py-2 cursor-pointer bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">Signup</h1>
        </div>
    )
}
export default SingUpRouter;