import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth_context";
import axios from "axios";

import Loading from "./Loading";

function Authenticate(){

    const auth_data = useContext(AuthContext);
    const { setUser, isLoading, setIsLoading } = auth_data;
    const token = localStorage.getItem('token'); // get token from local storage

    useEffect(() => {
        console.log("Authenticating Component was run");
        
        if(token !== "" && token !== undefined && token !== null){
            axios.defaults.headers["Authorization"] = `Bearer ${token}`
            axios.get('/api/account')
                .then(response => {
                    const { user } = response.data;
                    setUser(user); // for context api
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error.response.data);
                    localStorage.removeItem('token');
                    setIsLoading(false);
                })
            
        }else{
            setIsLoading(false);
        }

    }, [token]);

    if(isLoading){
        return (
            <Loading/>
        );
    }
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default Authenticate;
