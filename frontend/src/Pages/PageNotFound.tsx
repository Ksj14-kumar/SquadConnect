import { useNavigate } from "react-router-dom"
function PageNotFound() {
    const navigate = useNavigate()
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className="wrapper">
                <p className='text-[1.3rem] font-md font-sans tracking-wider text-white'>Page not found</p>
                <p className='text-center cursor-pointer text-[#e8c813] hover:underline hover:underline-offset-1 hover:underline-[#fff]'
                    onClick={() => {
                        navigate("/")
                    }}
                >
                    back to home
                </p>
            </div>
        </div>
    )
}
export default PageNotFound