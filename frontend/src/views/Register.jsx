import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../auth_context";

import AuthLayout from "../components/AuthLayout";

function Register(){
    const [ userData, setUserData ] = useState(
            {
                first_name: "",
                last_name: "",
                user_name: "",
                email: "",
                password: "",
                password2: ""
            });
    const [ isSubmitted, setIsSubmitted ] = useState(false);
		const [ httpErrorMessage, setHttpErrorMessage ] = useState("");

    const context = useContext(AuthContext);
    const { storeToken, user } = context;

    if(Object.keys(user).length){
        return (
            <Navigate to="/account"/>
        );
    }

    function submitForm(event){
        event.preventDefault();
            
        if(userData.first_name === "" || userData.email === "" || userData.password === "" || userData.password2 === "" || userData === ""){
            setIsSubmitted(true);
        }else if(userData.password !== userData.password2){
            setIsSubmitted(true);
        }else{
            axios.post("/api/user/register", userData)
                .then(response => {
                    const { token } = response.data;
										console.log(response.data);
                    storeToken(token);
                })
                .catch(error => {
									const { msg } = error.response.data;
									if(msg !== undefined && msg !== null){
										setHttpErrorMessage(msg);
									}
								})
        }
    }

    function handleOnChange(event){
        const target = event.target;
        setUserData((prevState, newState) => {
            return {
                ...prevState,
                [target.name]: target.value
            };
        })
    }

    return (
        <AuthLayout>
            <div className="register-form">
                <h3 className="text-center">Welcome to jobsearch</h3>
                <div>
                    <form onSubmit={submitForm}>
                        <div className="custom-input-container">
                            <label className="custom-label">Firstname</label>
                            <input className="custom-input" name="first_name"
                                onChange={handleOnChange} value={userData.first_name} type="text" placeholder="Firstname"/>
                            {/* error message */}
                            { isSubmitted && userData.first_name === "" && <small className="text-danger">First Name cannot be null</small> }
                        </div>
                        <div className="custom-input-container">
                            <label className="custom-label">Lastname</label>
                            <input className="custom-input" name="last_name"
                                onChange={handleOnChange} value={userData.last_name} type="text" placeholder="Lastname"/>
                        </div>
                        <div className="custom-input-container">
                            <label className="custom-label">Username</label>
                            <input className="custom-input" name="user_name"
                                onChange={handleOnChange} value={userData.user_name} type="text" placeholder="Username"/>
                            {/* error message */}
                            { isSubmitted && userData.user_name === "" && <small className="text-danger">User Name cannot be null</small> }
                        </div>
                        <div className="custom-input-container">
                            <label className="custom-label">Email</label>
                            <input className="custom-input" name="email" value={userData.email}
                                onChange={handleOnChange} type="email" placeholder="Email"/>
                            {/* error message */}
                            { isSubmitted && userData.email === "" && <small className="text-danger">Email field cannot be null</small> }
                        </div>
                        <div className="custom-input-container">
                            <label className="custom-label">Password</label>
                            <input className="custom-input" name="password" value={userData.password}
                                onChange={handleOnChange} type="password" placeholder="Password"/>
                            {/* error message */}
                            { isSubmitted && userData.password === "" && <small className="text-danger">Password field cannot be null</small> }
                        </div>
                        <div className="custom-input-container">
                            <label className="custom-label">Confirm Password</label>
                            <input className="custom-input" name="password2" value={userData.password2}
                                onChange={handleOnChange} type="password" placeholder="Confirm Password"/>
                            {/* error message */}
                            { isSubmitted && userData.password2 === "" && <small className="text-danger">Confirm Password field cannot be null</small> }
                        </div>
                        
                        {/* error message */}
                        { isSubmitted && userData.password !== userData.password2 &&
                            userData.password !== "" &&
                            userData.password2 !== "" &&
                            <small className="text-danger">Passwords not match</small>
                        }
                        
                        <div className="text-end">
                            <button className="custom-button-green">Register</button>
                        </div>
												<div className="text-danger text-center">
													{ httpErrorMessage !== "" && httpErrorMessage }
												</div>
                    </form>
                </div>
								<div>
										<span>You have an account?</span>
										{/* <a href="#" className="ms-1">Login here</a> */}
										<Link to="/login" className="ms-1">Login here</Link>
								</div>
            </div>
        </AuthLayout>
    );
}

export default Register;
