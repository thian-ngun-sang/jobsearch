import React, { useState, useEffect } from "react";

const AuthContext = React.createContext();

function AuthContextProvider(props){
    const auth_data = {
        token: "",
        user: {},
				baseUrl: process.env.REACT_APP_BACKEND_URL
    };

    const [authState, setAuthState] = useState(auth_data);
    const [isLoading, setIsLoading] = useState(true);
    const [searchState, setSearchState] = useState(false);
    const [appBackgroundMode, setAppBackgroundMode] = useState("default");

    function storeToken(token){
        localStorage.setItem('token', token);
        setAuthState(oldState => {
            return {
                ...oldState,
                token: token
            };
        });
    }

    function setUser(authUser){
        setAuthState(oldState => {
            return {
                ...oldState,
                user: authUser
            };
        });
    }

    function logout(){
        localStorage.removeItem('token');
        setAuthState(auth_data);
    }

    useEffect(() => {
        // console.log("auth_context was run");
    }, []);

    return (
        <AuthContext.Provider value={{...authState, storeToken, setUser, logout,
						isLoading, setIsLoading, searchState, setSearchState, appBackgroundMode, setAppBackgroundMode}}>
            {props.children}
        </AuthContext.Provider>
    )
}

// class AuthContextProvider extends Component{
//     state = {
//         token: "",
//     }

//     render(){
//         return (
//             <AuthContext.Provider value={{...this.state}}>
//                 {this.props.children}
//             </AuthContext.Provider>
//         );
//     }

// }

const AuthContextConsumer = AuthContext.Consumer;
export { AuthContextProvider, AuthContextConsumer, AuthContext };
