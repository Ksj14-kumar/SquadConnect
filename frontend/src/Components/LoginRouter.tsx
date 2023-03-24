import { useNavigate, useLocation } from "react-router-dom"
function LoginRouter() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    return (
        <div className={`login w-full  flex justify-center align-middle rounded-md rounded-tr-none rounded-br-none cursor-pointer px-2 py-1 ${pathname === "/login" || pathname === "/" ? "bg-gradient-to-r from-red-700 via-red-800 to-gray-900" : "bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900"}`}
            onClick={() => {
                navigate("/login")
            }}
        >
            <h1 className="text-center  tracking-widest font-serif text-[1.1rem]  w-full  rounded-md py-2 cursor-pointer bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">login</h1>
        </div>
    )
}
export default LoginRouter