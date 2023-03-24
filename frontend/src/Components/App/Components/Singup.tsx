import { SignUpUserType } from "../../../features/types/Alltypes"
import { useEffect, useState } from "react"
import { register } from "../../../features/Slices/Thunks"
import { Selector, useAppDispatch, useAppSelector } from "../../../features/store"
import { toast } from "react-hot-toast";
import { Rainbow } from "../../../loader/Spinner";
import { useNavigate } from "react-router-dom";
function Singup() {
    const [userInfo, setUserInfo] = useState({ email: "", password: "", cPassword: "" } as SignUpUserType)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isLoading } = useAppSelector(Selector)
    // useEffect(() => {
    //     isError && toast.error(message, { duration: 2000 })
    // }, [isError, message, dispatch])
    // useEffect(() => {
    //     isSuccess && toast.success(message, { duration: 2000 })
    // }, [isSuccess, message, dispatch])
    function onInputHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        const name: string = e.target.name
        setUserInfo({ ...userInfo, [name]: e.target.value })
    }
    const onSave: boolean = Boolean(userInfo.email) && Boolean(userInfo.password) && Boolean(userInfo.cPassword)
    async function onSubmit(): Promise<void> {
        if (userInfo.password !== userInfo.cPassword) {
            toast.error("password not match", { duration: 2000 })
        }
        if (userInfo.password === userInfo.cPassword) {
            if (onSave) {
                try {
                    const res: string = await dispatch(register(userInfo)).unwrap()
                    if (res) {
                        navigate("/login")
                    }
                }
                catch (err: unknown) {
                    const error = err as string
                    toast.error(error, { duration: 4000 })
                }
            }
        }
    }
    return (
        <div className="input_container w-full">
            <section className="input_email p-2 w-full">
                <input type="email" placeholder="Email" className="w-full rounded-md py-2 indent-2 tracking-wider drop-shadow-md shadow-md outline-none focus:outline-none"
                    name="email"
                    onChange={onInputHandler}
                    value={userInfo.email}
                />
            </section>
            <section className="passport p-2 w-full">
                <input type="password" placeholder="Password" className="w-full rounded-md py-2 indent-2 tracking-wider drop-shadow-md shadow-md outline-none focus:outline-none"
                    name="password"
                    onChange={onInputHandler}
                    value={userInfo.password}
                />
            </section>
            <section className="passport p-2 w-full">
                <input type="password" placeholder="Confirm Password" className="w-full rounded-md py-2 indent-2 tracking-wider drop-shadow-md shadow-md outline-none focus:outline-none"
                    name="cPassword"
                    onChange={onInputHandler}
                    value={userInfo.cPassword}
                />
            </section>
            <div className="block_btn p-2">
                <button className="w-full p-2 rounded-md text-[1.2rem] font-serif tracking-wider text-white bg-gradient-to-l from-gray-400 via-gray-600 to-blue-800 drop-shadow-md flex justify-center"
                    onClick={onSubmit}
                    disabled={!onSave}
                >
                    {isLoading ? <Rainbow /> : "Register"}
                </button>
            </div>
        </div>
    )
}
export default Singup