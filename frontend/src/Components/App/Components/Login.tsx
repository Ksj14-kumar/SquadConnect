import { loginType } from "../../../features/types/Alltypes";
import { useState } from "react"
import { Selector, useAppDispatch, useAppSelector } from "../../../features/store";
import { login } from "../../../features/Slices/Thunks";
import { Rainbow } from "../../../loader/Spinner";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Login() {
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" } as loginType)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isLoading } = useAppSelector(Selector)
    function onhandleInput(e: React.ChangeEvent<HTMLInputElement>): void {
        const name: string = e.target.name
        setLoginInfo({ ...loginInfo, [name]: e.target.value })
    }
    const onSave: boolean = Boolean(loginInfo.email) && Boolean(loginInfo.password)
    async function onSubmit(): Promise<void> {
        if (onSave) {
            try {
                // TODO: Remaing worked login, it is not worked properly
                const res = await dispatch(login(loginInfo)).unwrap()
                if (res) {
                    toast.success("login success", { duration: 2000 })
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                }
            } catch (err: unknown) {
                const error = err as string
                toast.error(error, { duration: 2000 })
            }
        }
    }
    return (
        <div className="input_container w-full">
            <section className="input_email p-2 w-full">
                <input type="email" placeholder="Email" className="w-full rounded-md py-2 indent-2 tracking-wider drop-shadow-md shadow-md outline-none focus:outline-none"
                    name="email"
                    onChange={onhandleInput}
                    value={loginInfo.email}
                />
            </section>
            <section className="passport p-2 w-full">
                <input type="password" placeholder="Password" className="w-full rounded-md py-2 indent-2 tracking-wider drop-shadow-md shadow-md outline-none focus:outline-none"
                    name="password"
                    onChange={onhandleInput}
                    value={loginInfo.password}
                />
            </section>
            <div className="block_btn p-2">
                <button className="w-full p-2 rounded-md text-[1.2rem] font-serif tracking-wider text-white bg-gradient-to-l from-gray-400 via-gray-600 to-blue-800 drop-shadow-md
                flex justify-center
                "
                    onClick={onSubmit}
                    disabled={!onSave}
                >{isLoading ? <Rainbow /> : "Submit"}</button>
            </div>
        </div>
    )
}
export default Login;