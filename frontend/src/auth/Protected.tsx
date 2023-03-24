import { Navigate, Outlet } from "react-router-dom"
function Protected({ isAuth }: { isAuth: boolean }) {
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}
export default Protected;