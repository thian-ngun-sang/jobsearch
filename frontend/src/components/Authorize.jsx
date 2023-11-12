import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth_context";

function Auth({ children }){
    const authData = useContext(AuthContext);
    const { user } = authData;

    // redirect unauthorize user from "restrictedRouteList" to "login"
    // if user === !false && restrictedRoute === true => navigate to "login"
    if(!Object.keys(user).length){
        return (
            <Navigate to="/login"/>
        );
    }

    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default Auth;