interface itemInterface {
    name: string,
    icon: JSX.Element,
    id: number
}
type PropType = {
    item: itemInterface
}
// const URL= process.env.REACT_APP_BACKEND_DOMAIN
function LoginProvider({ item }: PropType): JSX.Element {
    return (
        <div className="google_btn flex justify-center items-center  rounded-md py-0 my-2 px-[3.3rem] mobile:px-[1rem] cursor-pointer overflow-hidden"
            onClick={() => {
                if (item.id === 1) {
                    const res = window.open("/api/v1/login/google", "_self")
                }
                else if (item.id === 2) {
                    window.open("/api/v1/login/facebook", "_self")
                }
                else if (item.id === 3) {
                    window.open("/api/v1/login/github", "_self")
                }
            }}
        >
            <div className="logo_icons py-2 h-full bg-red-600 flex justify-center align-middle w-full rounded-md rounded-tr-none rounded-br-none bg-gradient-to-r from-gray-700 via-gray-900 to-black">
                {item.icon}
            </div>
            {/* <div className="divider  w-[.3rem]"></div> */}
            <div className="btn_google bg-red-300 flex justify-center align-middle w-full rounded-md rounded-tl-none rounded-bl-none flex-nowrap bg-gradient-to-l from-gray-700 via-gray-900 to-black">
                <button className="google_login text-center px-2 rounded-tr-md rounded-br-md py-[.79rem] mobile:py-[.62rem] break-words mobile:text-[.8rem] font-serif tracking-wider text-white">{item.name}</button>
            </div>
        </div>
    )
}
export default LoginProvider;