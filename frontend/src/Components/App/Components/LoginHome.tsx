import Login from './Login'
import LoginProvider from '../../LoginProvider'
import LoginRouter from '../../LoginRouter'
import SingUpRouter from '../../SingUpRouter'
import { useLocation } from "react-router-dom"
import SingUp from "./Singup"
import { loginProviderType } from '../../../features/types/Alltypes'
import { LoginProviders } from '../../../stuff/ProviderArray'
const loginTypeProvider: loginProviderType[] = LoginProviders
function LoginHome(): JSX.Element {
  const { pathname } = useLocation()
  return (
    <div className="wrapper_home  w-screen h-[calc(100vh-0rem)] md:p-[10rem]   md:pt-[6rem] pt-[3rem] px-[.5rem]  bg-[#2f0303] bg-gradient-to-l from-gray-700 via-gray-900 to-black overflow-hidden">
      <div className="login_page   rounded-md mb-4 bg-gradient-to-b from-gray-900 to-gray-600 bg-gradient-to-r">
        {/* TODO:Email and password authenticate */}
        {/* <header className="header_login py-2 px-[1.5rem]">
          <div className="login_signup_button flex justify-center">
            <LoginRouter />
            <SingUpRouter />
          </div>
        </header>
        <main className="input_fields p-4  w-full flex justify-center flex-col items-center">
          {
            pathname === "/register" ?
              <SingUp /> : <Login />
          }
        </main> */}
        <footer className="login_provviders px-4">
          <main className="group_btn  py-1">
            {loginTypeProvider.map((item: loginProviderType, index: number) => {
              return <LoginProvider item={item} key={index} />
            })
            }
          </main>
        </footer>
      </div>
    </div>
  )
}
export default LoginHome